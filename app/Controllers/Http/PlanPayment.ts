import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import TokenService from 'App/Services/TokenService';
import AssociadoService from 'App/Services/AssociadoService';
import AssociadoComPlanoJaCadastrado from 'App/Exceptions/AssociadoComPlanoJaCadastrado';
import TokenInvalidoException from 'App/Exceptions/TokenInvalidoException';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import FormasPagamentoService from 'App/Services/FormasPagamentoService';
import { DateTime } from 'luxon';
import UfService from 'App/Services/UfService';
import TbUf from 'App/Models/TbUf';
import TbFormasPagamento from 'App/Models/TbFormasPagamento';
import ResponsavelFinanceiroService from 'App/Services/ResponsavelFinanceiroService';
import DependenteService from 'App/Services/DependenteService';
import DocumentService from 'App/Services/DocumentService';
import TbAssociado from 'App/Models/TbAssociado';
import PagamentoDebitoService from 'App/Services/PagamentoDebitoService';
import OdontoCobService from 'App/Services/OdontoCobService';
import NaoFoiPossivelGerarBoletoException from 'App/Exceptions/NaoFoiPossivelGerarBoletoException';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';
import SmsService from 'App/Services/SmsService';
import { Exception } from '@adonisjs/core/build/standalone';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import NaoFoiPossivelGerarPagamentoCartaoException from 'App/Exceptions/NaoFoiPossivelGerarPagamentoCartaoException';

@inject()
export default class PlanPayment {

  constructor(private tokenService: TokenService
      , private associadoService: AssociadoService
      , private formasPagamentoService: FormasPagamentoService
      , private ufService: UfService
      , private responsavelFinanceiroService: ResponsavelFinanceiroService
      , private dependenteService: DependenteService
      , private documentService: DocumentService
      , private pagamentoDebitoService: PagamentoDebitoService
      , private odontoCobService: OdontoCobService
      , private smsService: SmsService) {} 

  async index({ request, response }: HttpContextContract) {
    await Database.transaction(async (transaction) => {
      try {
        const retorno = await this.fluxoPagamentoPlano(request, transaction);
        transaction.commit();

        return retorno;
      } catch (error) {
        transaction.rollback();
        console.log(error);
      }
    })
  }

  async fluxoPagamentoPlano(request: RequestContract, transaction: TransactionClientContract) {
    const params = request.all()
    const token = params.token

    if(token && (await this.tokenService.isTokenValido(token))) {
        throw new TokenInvalidoException();
    }

    const tokenBanco = await this.tokenService.findToken(token);
    const parceiro = tokenBanco.parceiro
    const produtoComercial = parceiro.produtoComercial
   
    //verifica se produto faz parte da assefaz?

    const associado = await this.associadoService.findAssociado(params.cpf);

    if (associado.cd_status && associado.cd_status != 0) {
        throw new AssociadoComPlanoJaCadastrado();
    }

    const formaPagamento = await this.formasPagamentoService.findFormaPagamento(produtoComercial.id_prodcomerc, params.idBanco, params.formaPagamento)
    
    if (!formaPagamento) {
      throw new FormaPagamentoNaoEncontrada();
    }

    let dataExpiracao = this.calcularDataExpiracao(params);

    let valorMensalidade = this.calculaPagamentoUnico(formaPagamento.vl_valor, params.formaPagamento.gpPagto, formaPagamento.nu_PagUnico);

    let quantidadeVidas = this.calculaNumeroVidas(1, params.dependentes);
    
    const valorContrato = valorMensalidade * quantidadeVidas;
  
    const uf = await this.ufService.findUfBySigla(params.uf)

    await this.salvarAssociado(associado, params, uf, formaPagamento, valorContrato, dataExpiracao, tokenBanco.vendedor.id_vendedor, transaction)

    this.responsavelFinanceiroService.deleteResponsavelFinanceiroByIdAssociado(associado.id_associado, transaction)

    const responsavelFinanceiroBanco = await this.saveResponsavelFinanceiro(params, uf, associado, transaction);

    await this.saveDependentes(params, associado, transaction);

    //this.saveDocuments(params, associado); pular tudo de documento

    //await this.emailConsignado(params, associado)

    return await this.executaPagamento(params, associado, valorContrato, dataExpiracao.toString(), responsavelFinanceiroBanco, transaction, produtoComercial.nm_prodcomerc)
  }

  async executaPagamento(
      params: any,
      associado: TbAssociado,
      valorContrato: number,
      dataExpiracao: string,
      responsavelFinanceiroBanco: TbResponsavelFinanceiro,
      transaction: TransactionClientContract,
      nomePlano: string) {
    let returnPayment: any
    if(params.formaPagamento.gpPagto == 2) { //Boleto
      await this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);

      await this.pagamentoDebitoService.savePagamentoDebito(params, associado, valorContrato, dataExpiracao, transaction)

      if (params.primeiraBoleto) {
        returnPayment = await this.odontoCobService.gerarBoleto(associado, responsavelFinanceiroBanco, dataExpiracao, valorContrato, transaction, nomePlano)

        if (!returnPayment.linkPagamento) {
          throw new NaoFoiPossivelGerarBoletoException();
        }

        if (responsavelFinanceiroBanco) {
          this.smsService.sendSmsUrl(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin)
        } else {
          this.smsService.sendSmsUrl(associado.nu_dddCel + associado.nu_Celular)
        }
      } else {
        returnPayment.formaPagamento = "Débito em Conta";
        returnPayment.agencia = params.agencia;
        returnPayment.conta = params.conta;
        returnPayment.linkPagamento = '';

        await this.associadoService.ativarPlanoAssociado(associado);
      }
    } else if (params.formaPagamento.gpPagto == 4) { //  CONSIGNADO NAO SERA FEITO AGORA
      throw new Exception("PAGAMENTO CONSIGANDO NAO FOI DESENVOLVIDO");
    } else {
      if (associado.id_meiopagto_a == 1) {//CARTAO
        returnPayment = await this.odontoCobService.geraCartao(associado, responsavelFinanceiroBanco, transaction, dataExpiracao, nomePlano)

        if (!returnPayment.linkPagamento) {
          throw new NaoFoiPossivelGerarPagamentoCartaoException();
        }

        if (responsavelFinanceiroBanco) {
          this.smsService.sendSmsUrl(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin)
        } else {
          this.smsService.sendSmsUrl(associado.nu_dddCel + associado.nu_Celular)
        }
      }
    }

    return returnPayment;
  }

  async emailConsignado(params: any, associado: TbAssociado) {
    if (params.chkDocumentoConsignado) {
      //documento associado
    } else {
      // await Mail.send((message) => {
      //   message
      //     .to(associado.ds_email)
      //     .subject('Formulário de Autorização de desconto em folha no GDF')
      //     .htmlView('mail.sendFormAuthorizationMail', { cliente: associado.nm_associado })
      //     .attach('https://www.odontogroup.com.br/vendas/PDF/AUTORIZACAO_DESCONTO_EM_FOLHA_GDF.pdf')
      // })
    }
  }

  createVendedor(vendedor: any) {

    const vendedorRetorno = {} as any
    
    if (vendedor.tx_nome) {
      vendedorRetorno.nomeCompleto = vendedor.tx_nome
      vendedorRetorno.nome = vendedor.tx_nome.split(" ")
      vendedorRetorno.PN = vendedorRetorno.nome[0]
      vendedorRetorno.ID = vendedor.id_vendedor
    } else {
      vendedorRetorno.nomeCompleto = "Vendedor Web"
      vendedorRetorno.PN = "OdontoGroup"
      vendedorRetorno.ID = 65083
    }

    return vendedorRetorno
  }

  saveDocuments(params: any, associado: TbAssociado) {
    params.docs && params.docs.forEach(doc => {
        // if (doc.isValid) {
        //   const path = this.documentService.uploadImage(doc, associado.id_associado);
          
        //   const storagePath = Drive.disk('local').get(path);
        // }
    });
  }

  async saveDependentes(params: any, associado: TbAssociado, transaction: TransactionClientContract) { //todo promise all
      params.dependentes && await params.dependentes.forEach(async depen => {
        await this.dependenteService.saveDependente(depen, associado, transaction)
      });
  }

  async saveResponsavelFinanceiro(params:any, uf: TbUf, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbResponsavelFinanceiro> {
    let ufResponsavelFinanceiro = await this.ufService.findUfBySigla(params.responsavelFinanceiro.uf)

    return params.chkResp ? 
      await this.responsavelFinanceiroService.saveResponsavelFinanceiroByAssociado(params, associado, uf, transaction)
      : await this.responsavelFinanceiroService.saveResponsavelFinanceiro(params, associado, ufResponsavelFinanceiro.id_uf, transaction)
  }

  async salvarAssociado(associado: TbAssociado, params: any, uf: TbUf, formaPagamento: TbFormasPagamento, valorContrato: number, dataExpiracao: DateTime, idVendedor: number, transaction: TransactionClientContract) {
    const dadosAssociado = await this.associadoService.buildAssociado(params, uf, formaPagamento, valorContrato, dataExpiracao, idVendedor);
    
    await this.associadoService.saveAssociado(associado, dadosAssociado, transaction);
  }

  calculaPagamentoUnico(valorMensalidade: number, gpPagto: number, pagamentoUnico) {
    return gpPagto == 3 && pagamentoUnico ? valorMensalidade * 12 : valorMensalidade;
  }

  calculaNumeroVidas(quantidadeVidas: number, dependentes: []) {
    return quantidadeVidas + (dependentes && dependentes.length || 0);
  }

  calcularDataExpiracao(params: any): DateTime {
    switch(params.formaPagamento.gpPagto) {
      case 1: 
        return DateTime.local().plus({ days: 7 })

      case 2:
        if (params.chkPrimeiraBoleto) {
          return DateTime.local();
        } else {
          return DateTime.fromFormat(params.vencimentoDebito ? params.vencimentoDebito : params.vencimentoBoleto, "yyyy/mm/dd")
        }

      case 3:
        return DateTime.fromFormat(params.vencimentoBoleto, "yyyy/mm/dd");
        
      case 4: 
        if (params.chkPrimeiraBoleto) {
          return DateTime.fromFormat(params.vencimentoBoleto, "yyyy/mm/dd");
        }
        else {
          return DateTime.fromFormat(params.vencimentoConsignado, "yyyy/mm/dd");
        }

      default:
        throw new FormaPagamentoNaoEncontrada();
    }
  }
}

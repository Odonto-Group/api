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
import NaoFoiPossivelGerarBoletoException from 'App/Exceptions/NaoFoiPossivelGerarBoletoException';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';
import SmsService from 'App/Services/SmsService';
import { Exception } from '@adonisjs/core/build/standalone';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import NaoFoiPossivelGerarPagamentoCartaoException from 'App/Exceptions/NaoFoiPossivelGerarPagamentoCartaoException';
import FluxoPagamentoBoleto from 'App/Services/Fluxo/Pagamento/FluxoPagamentoBoleto';
import FluxoPagamentoCartao from 'App/Services/Fluxo/Pagamento/FluxoPagamentoCartao';
import RetornoGeracaoPagamento from 'App/interfaces/RetornoGeracaoPagamento.interface';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import MetodoDePagamentoInvalidoException from 'App/Exceptions/MetodoDePagamentoInvalidoException';
import TbOrgaoExpedidor from 'App/Models/TbOrgaoExpedidor';
import OrgaoExpedidorInvalido from 'App/Exceptions/OrgaoExpedidorInvalido';
import TbDependente from 'App/Models/TbDependente';

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
      , private smsService: SmsService
      , private fluxoPagamentoBoleto: FluxoPagamentoBoleto
      , private fluxoPagamentoCartao: FluxoPagamentoCartao) {} 

  async index({ request, response }: HttpContextContract) {
    let retorno = {}
    await Database.transaction(async (transaction) => {
      try {
        retorno = await this.fluxoPagamentoPlano(request, transaction);
        transaction.commit();

        return retorno;
      } catch (error) {
        transaction.rollback();
        throw error;
      }
    })
    return retorno;
  }

  async fluxoPagamentoPlano(request: RequestContract, transaction: TransactionClientContract) {
    const params = request.all()
    const token = params.token

    if(token && !(await this.tokenService.isTokenValido(token))) {
        throw new TokenInvalidoException();
    }

    const tokenParceiro = await this.tokenService.findToken(token);
    const parceiro = tokenParceiro.parceiro
    const produtoComercial = parceiro.produtoComercial

    const associado = await this.associadoService.findAssociadoByCpf(params.cpf);

    if (associado.cd_status && associado.cd_status != 0) {
        throw new AssociadoComPlanoJaCadastrado();
    }

    const formaPagamento = await this.formasPagamentoService.findFormaPagamento(produtoComercial.id_prodcomerc, params.idBanco, params.formaPagamento)
    
    if (!formaPagamento) {
      throw new FormaPagamentoNaoEncontrada();
    }

    let dataExpiracao = this.calcularDataExpiracao(params);

    let valorMensalidade = this.calculaValorMensalidade(formaPagamento.vl_valor, params.formaPagamento.gpPagto, formaPagamento.nu_PagUnico);

    let quantidadeVidas = this.calculaNumeroVidas(1, params.dependentes);
    
    const valorContrato = valorMensalidade * quantidadeVidas;

    await this.salvarAssociado(associado, params, formaPagamento, valorContrato, dataExpiracao, tokenParceiro.vendedor.id_vendedor, transaction)
    
    this.responsavelFinanceiroService.deleteResponsavelFinanceiroByIdAssociado(associado.id_associado, transaction)

    const responsavelFinanceiroBanco = await this.saveResponsavelFinanceiro(params, associado, transaction);

    await this.saveDependentes(params, associado, transaction);

    //this.saveDocuments(params, associado); pular tudo de documento

    //await this.emailConsignado(params, associado)

    const returnPayment =  await this.executaPagamento(params, associado, valorContrato, dataExpiracao.toString(), responsavelFinanceiroBanco, transaction, produtoComercial.nm_prodcomerc)
  
    return this.criarRetornoPagamento(returnPayment, params, associado, quantidadeVidas, valorMensalidade, produtoComercial.nm_prodcomerc, tokenParceiro.vendedor.tx_nome);
  }

  async executaPagamento(
      params: any,
      associado: TbAssociado,
      valorContrato: number,
      dataPrimeiroVencimento: string,
      responsavelFinanceiro: TbResponsavelFinanceiro,
      transaction: TransactionClientContract,
      nomePlano: string): Promise<RetornoGeracaoPagamento> {
  
    let returnPayment = {} as RetornoGeracaoPagamento

    if(params.formaPagamento.gpPagto == 2) { //DEBITO EM CONTA
      await this.pagamentoDebitoService.removePagamentoDebitoByIdAssociado(associado, transaction);

      await this.pagamentoDebitoService.savePagamentoDebito(params, associado, valorContrato, dataPrimeiroVencimento, transaction)

      if (params.primeiraBoleto) { // PRIMEIRA NO BOLETO
        returnPayment = await this.iniciaEnvioBoleto(associado, valorContrato, dataPrimeiroVencimento, responsavelFinanceiro, transaction, nomePlano)
      
        returnPayment.formaPagamento = FormaPagamento.PRIMEIRA_NO_BOLETO
      } else {
        returnPayment.formaPagamento = FormaPagamento.DEBITO_EM_CONTA;
        returnPayment.agencia = params.agencia;
        returnPayment.conta = params.conta;
        returnPayment.linkPagamento = '';

        await this.associadoService.ativarPlanoAssociado(associado, transaction);
      }
    } else if (params.formaPagamento.gpPagto == 4) { //  CONSIGNADO NAO SERA FEITO AGORA
      throw new Exception("PAGAMENTO CONSIGNADO NÃO FOI DESENVOLVIDO");

    } else if (params.formaPagamento.gpPagto == 3) { // BOLETO
      returnPayment = await this.iniciaEnvioBoleto(associado, valorContrato, dataPrimeiroVencimento, responsavelFinanceiro, transaction, nomePlano)

    } else if (params.formaPagamento.gpPagto == 1)  { //CARTAO
      returnPayment = await this.fluxoPagamentoCartao.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, params})

      if (!returnPayment.linkPagamento) {
        throw new NaoFoiPossivelGerarPagamentoCartaoException();
      }

      this.enviaSms(responsavelFinanceiro, associado)
    } else {
      throw new MetodoDePagamentoInvalidoException()
    }

    return returnPayment;
  }

  private async criarRetornoPagamento(returnPayment: RetornoGeracaoPagamento, params: any, associado: TbAssociado, quantidadeVidas: number, valorMensalidade: number, nomePlano: string, nomeVendedor: string) {
    returnPayment.idAssociado = associado.id_associado
    returnPayment.dataCadastro = associado.dt_Cadastro
    returnPayment.email = associado.ds_email
    returnPayment.numeroProposta = associado.nr_proposta
    returnPayment.nome = associado.nm_associado
    returnPayment.quantidadeVidas = quantidadeVidas;
    returnPayment.valorPagamento = valorMensalidade
    returnPayment.nomePlano = nomePlano;
    returnPayment.telefone = associado.nu_Celular
    returnPayment.nomeVendedor = nomeVendedor
    returnPayment.linkProposta = `https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/1/${associado.id_associado}`

    return returnPayment;
  }

  async iniciaEnvioBoleto(
    associado: TbAssociado,
    valorContrato: number,
    dataPrimeiroVencimento: string,
    responsavelFinanceiro: TbResponsavelFinanceiro,
    transaction: TransactionClientContract,
    nomePlano: string): Promise<RetornoGeracaoPagamento> {
    const returnPayment = await this.fluxoPagamentoBoleto.iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, valorContrato, transaction, nomePlano})

    if (!returnPayment.linkPagamento) {
      throw new NaoFoiPossivelGerarBoletoException();
    }

    await this.enviaSms(responsavelFinanceiro, associado)

    return returnPayment;
  }

  async enviaSms(responsavelFinanceiroBanco: TbResponsavelFinanceiro, associado: TbAssociado) {
    if (responsavelFinanceiroBanco) {
      await this.smsService.sendSmsUrl(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin)
    } else {
      await this.smsService.sendSmsUrl(associado.nu_dddCel + associado.nu_Celular)
    }
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

  async saveDependentes(params: any, associado: TbAssociado, transaction: TransactionClientContract) {
    if (params.dependentes) {
      await TbDependente
        .query()
        .where('cd_associado_d', associado.id_associado)
        .useTransaction(transaction).delete()

      const dependentePromises = params.dependentes.map((depen) => 
          this.dependenteService.saveDependente(depen, associado, transaction)
      );

      await Promise.all(dependentePromises);
    }
  }

  async saveResponsavelFinanceiro(params:any, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbResponsavelFinanceiro> {
    return params.chkResp ? 
      await this.responsavelFinanceiroService.saveResponsavelFinanceiroByAssociado(params, associado, transaction)
      : await this.responsavelFinanceiroService.saveResponsavelFinanceiro(params, associado, transaction)
  }

  async salvarAssociado(associado: TbAssociado, params: any, formaPagamento: TbFormasPagamento, valorContrato: number, dataExpiracao: DateTime, idVendedor: number, transaction: TransactionClientContract) {
    await this.associadoService.buildAssociado(associado, params, formaPagamento, valorContrato, dataExpiracao, idVendedor);
    
    await this.associadoService.saveAssociado(associado, transaction);
  }

  calculaValorMensalidade(valorMensalidade: number, gpPagto: number, pagamentoUnico) {
    return gpPagto == 3 && pagamentoUnico ? valorMensalidade * 12 : valorMensalidade;
  }

  calculaNumeroVidas(quantidadeVidas: number, dependentes: []) {
    return quantidadeVidas + (dependentes && dependentes.length || 0);
  }

  calcularDataExpiracao(params: any): DateTime {
    switch(params.formaPagamento.gpPagto) {
      case 1: 
        return DateTime.now().plus({ days: 7 })
      case 2:
        if (params.chkPrimeiraBoleto) {
          return DateTime.now();
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

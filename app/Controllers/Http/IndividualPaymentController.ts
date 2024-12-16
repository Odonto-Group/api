import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import TokenService from 'App/Services/TokenService';
import AssociadoService from 'App/Services/AssociadoService';
import AssociadoComPlanoJaCadastrado from 'App/Exceptions/AssociadoComPlanoJaCadastrado';
import TokenInvalidoException from 'App/Exceptions/TokenInvalidoException';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import FormasPagamentoService from 'App/Services/FormasPagamentoService';
import { DateTime } from 'luxon';
import ResponsavelFinanceiroService from 'App/Services/ResponsavelFinanceiroService';
import DependenteService from 'App/Services/DependenteService';
import TbAssociado from 'App/Models/TbAssociado';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';
import SmsService from 'App/Services/SmsService';
import { Exception } from '@adonisjs/core/build/standalone';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import FluxoPagamentoBoletoIndividual from 'App/Services/Fluxo/Pagamento/FluxoPagamentoBoletoIndividual';
import FluxoPagamentoCartaoIndividual from 'App/Services/Fluxo/Pagamento/FluxoPagamentoCartaoIndividual';
import FluxoPagamentoConsignadoIndividual from 'App/Services/Fluxo/Pagamento/FluxoPagamentoConsignadoIndividual';
import RetornoGeracaoPagamento from 'App/interfaces/RetornoGeracaoPagamentoIndividual.interface';
import MetodoDePagamentoInvalidoException from 'App/Exceptions/MetodoDePagamentoInvalidoException';
import TbDependente from 'App/Models/TbDependente';
import DataExpiracaoInvalida from 'App/Exceptions/DataExpiracaoInvalida';
import formatNumberBrValue from 'App/utils/FormatNumber';
import FluxoPagamentoDebitoIndividual from 'App/Services/Fluxo/Pagamento/FluxoPagamentoDebitoIndividual';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import { GrupoPagamento } from "App/Enums/GrupoPagamento";
import FileService from 'App/Services/FileService';
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import RetornoGeracaoPagamentoIndividual from 'App/interfaces/RetornoGeracaoPagamentoIndividual.interface';
import IndividualPaymentValidator from 'App/Validators/IndividualPaymentValidator';
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import LogService from 'App/Services/Log/Log';
import { MailSenderService } from 'App/Services/MailSenderService';
import ErroEmailContent from 'App/interfaces/ErroEmailContent.interface';

@inject()
export default class IndividualPaymentController {

  constructor(private tokenService: TokenService
      , private associadoService: AssociadoService
      , private formasPagamentoService: FormasPagamentoService
      , private responsavelFinanceiroService: ResponsavelFinanceiroService
      , private dependenteService: DependenteService
      , private smsService: SmsService
      , private fluxoPagamentoBoleto: FluxoPagamentoBoletoIndividual
      , private fluxoPagamentoCartao: FluxoPagamentoCartaoIndividual
      , private fluxoPagamentoDebito: FluxoPagamentoDebitoIndividual
      , private fluxopagamentoConsignado: FluxoPagamentoConsignadoIndividual
      , private logService: LogService
      , private mailService: MailSenderService
      , private fileService: FileService) {
        this.logService = new LogService();
      }

  async index({ request, response }: HttpContextContract) {   
    const entrada = request.all();
    const tipoRequisicao = 'Pagamento';
    const Id = entrada.proposta || entrada.cpf;

    this.logService.writeLog(Id, tipoRequisicao, { local:'individual', type: 'entrada', data: entrada });

    await Database.transaction(async (transaction) => {
      try {
        const retorno = await this.fluxoPagamentoPlano(request, transaction);
        this.logService.writeLog(Id , tipoRequisicao, { local:'individual', type: 'saida', data: retorno });
        transaction.commit();

        return retorno;
      } catch (error) {
        this.logService.writeLog(Id, tipoRequisicao, { local:'individual', type: 'erro', data: error });
        const associado = await this.associadoService.findAssociadoByCpf(entrada.cpf);
        await this.associadoService.updateAssociadoIncompleto(associado, transaction);
        transaction.commit();
        
        await this.mailService.sendMailError(associado, entrada.formaPagamento.gpPagto, Id);
        
        throw error;
      }
    })
  }

  private linkArquivoIndividualDependente = Env.get('LINK_ARQUIVO_INDIVIDUAL_DEPENDENTE')
  private nomeArquivoIndividualDependente = Env.get('COMPROVANTE_VINCULO_INDIVIDUAL_DEPENDENTE_ARQUIVO')

  async fluxoPagamentoPlano(request: RequestContract, transaction: TransactionClientContract) {
    const nomeArquivo = this.nomeArquivoIndividualDependente.replace("idDependente", "123TESTE123".toString());
    const caminhoArquivo = this.linkArquivoIndividualDependente.replace("idAssociado", "123TESTE123".toString());
    const teste = request.all();
    console.log('entrada teste:', teste);
    const params = await request.validate(IndividualPaymentValidator)
    const token = params.token
    const arquivos = request.allFiles()

    console.log('Chegou e validou:', params);

    // await Drive.put(caminhoArquivo + nomeArquivo, "teste")

    if(token && !(await this.tokenService.isTokenValido(token))) {
        throw new TokenInvalidoException();
    }

    const tokenParceiro = await this.tokenService.findTokenParceiroIndividual(token);

    const parceiro = tokenParceiro.parceiro;
    
    const produtoComercial = parceiro.produtoComercial
    const produtosGDF = [993,998,999,1000];
    const associado = await this.associadoService.findAssociadoByCpf(params.cpf);
    let GDF = false;
    if(!params.verifica){
      GDF = produtosGDF.includes(produtoComercial.id_prodcomerc);
    } 
    

    if (associado.cd_status && associado.cd_status != 0 && !GDF) {
        throw new AssociadoComPlanoJaCadastrado();
    }

    const formaPagamento = await this.formasPagamentoService.findFormaPagamentoIndividual(produtoComercial.id_prodcomerc, params.idBanco ? Number(params.idBanco) : 1, params.formaPagamento)
    
    if (!formaPagamento) {
      throw new FormaPagamentoNaoEncontrada();
    }

    let dataExpiracao = this.calcularDataExpiracao(params);
    
    if (dataExpiracao.startOf('day') < DateTime.now().startOf('day')) {
      throw new DataExpiracaoInvalida();
    }

    let valorMensalidade = this.calculaValorMensalidade(formaPagamento.vl_valor, params.formaPagamento.gpPagto, formaPagamento.nu_PagUnico);

    let quantidadeVidas = this.calculaNumeroVidas(1, params.dependentes == undefined ? 0 : params.dependentes.length);
    
    const valorContrato = GDF && params.valor_Mensalidade ? params.valor_Mensalidade : valorMensalidade * quantidadeVidas;

    await this.associadoService.buildAssociado(associado, params, formaPagamento, valorContrato, dataExpiracao, tokenParceiro.vendedor.id_vendedor, GDF, transaction);
    
    this.responsavelFinanceiroService.deleteResponsavelFinanceiroByIdAssociado(associado.id_associado, transaction)

    const responsavelFinanceiroBanco = await this.saveResponsavelFinanceiro(params, associado, transaction);

    const dependentes = await this.saveDependentes(params, associado, transaction);

    //await this.emailConsignado(params, associado)

    const returnPayment =  await this.executaPagamento(params, associado, dataExpiracao, responsavelFinanceiroBanco, transaction, produtoComercial.id_ProdutoS4E_c, produtoComercial.nm_prodcomerc)
  
    // if (arquivos) {
    //   await this.salvarArquivos(dependentes, arquivos, associado);
    // }

    return this.criarRetornoPagamento(returnPayment, params, associado, quantidadeVidas, valorContrato, produtoComercial.nm_prodcomerc, tokenParceiro.vendedor.tx_nome, dataExpiracao);
  }

  async salvarArquivos(dependentes: TbDependente[], arquivos: MultipartFileContract, associado: TbAssociado) {
    dependentes.forEach(async dependente => {
      const key = Object.keys(arquivos).find(key => key.includes(dependente.nu_cpf)) || "";
      const file = arquivos[key]
      if (file) {
        await this.fileService.salvarArquivoIndividualDependente(dependente.id_dependente, file, associado.id_associado);
      }
    })
  }

  async executaPagamento(
      params: any,
      associado: TbAssociado,
      dataPrimeiroVencimento: DateTime,
      responsavelFinanceiro: TbResponsavelFinanceiro,
      transaction: TransactionClientContract,
      idPlanoS4E: number,
      nomePlano: string): Promise<RetornoGeracaoPagamento> {
  
    let returnPayment = {} as RetornoGeracaoPagamento

    if(params.formaPagamento.gpPagto == GrupoPagamento.DEBITO_EM_CONTA) { //DEBITO EM CONTA

      returnPayment = await this.fluxoPagamentoDebito.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, params})
    } else if (params.formaPagamento.gpPagto == GrupoPagamento.CONSIGNADO) { //  CONSIGNADO
      returnPayment = await this.fluxopagamentoConsignado.iniciarFluxoPagamento({associado, responsavelFinanceiro, dataPrimeiroVencimento, transaction, nomePlano, idPlanoS4E, formaPagamento: FormaPagamento.CONSIGNADO, params})
      //throw new Exception("PAGAMENTO CONSIGNADO NÃO FOI DESENVOLVIDO");
    } else if (params.formaPagamento.gpPagto == GrupoPagamento.BOLETO) { // BOLETO

      returnPayment = await this.fluxoPagamentoBoleto.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, formaPagamento: FormaPagamento.BOLETO, boletoUnico: 0})
    } else if (params.formaPagamento.gpPagto == GrupoPagamento.CARTAO_CREDITO)  { //CARTAO
      returnPayment = await this.fluxoPagamentoCartao.iniciarFluxoPagamento({associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, params})
    } else {
      throw new MetodoDePagamentoInvalidoException()
    }
    
    if (associado.cd_status == 0) {
      this.smsService.enviaSmsResponsavelAdesao(responsavelFinanceiro, associado, nomePlano, returnPayment.linkPagamento)
    } else {
      this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado)
    }
    
    
    return returnPayment;
  }

  private async criarRetornoPagamento(returnPayment: RetornoGeracaoPagamentoIndividual, params: any, associado: TbAssociado, quantidadeVidas: number, valorMensalidade: number, nomePlano: string, nomeVendedor: string, dataPrimeiroVencimento: DateTime) {
    returnPayment.idAssociado = associado.id_associado
    returnPayment.dataCadastro = associado.dt_Cadastro
    returnPayment.email = associado.ds_email
    returnPayment.numeroProposta = associado.nr_proposta
    returnPayment.nome = associado.nm_associado
    returnPayment.quantidadeVidas = quantidadeVidas;
    returnPayment.valorPagamento = formatNumberBrValue(valorMensalidade)
    returnPayment.nomePlano = nomePlano;
    returnPayment.telefone = associado.nu_dddCel + associado.nu_Celular
    returnPayment.nomeVendedor = nomeVendedor
    returnPayment.linkProposta = `https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/1/${associado.id_associado}`
    returnPayment.dataVencimento = dataPrimeiroVencimento.toString()
    returnPayment.ddd = associado.nu_dddCel

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
 
  async saveDependentes(params: any, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbDependente[]> {
    const dependentes: TbDependente[] = []
    if (params.dependentes) {
      await TbDependente
        .query()
        .where('cd_associado_d', associado.id_associado)
        .useTransaction(transaction).delete();
  
      const dependentePromises = params.dependentes.map(async (depen: any) => {
        const dependente = await this.dependenteService.saveDependente(depen, associado, transaction);
        dependentes.push(dependente)
      });
  
      await Promise.all(dependentePromises);
    }

    return dependentes
  }

  async saveResponsavelFinanceiro(params:any, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbResponsavelFinanceiro> {
      return await this.responsavelFinanceiroService.saveResponsavelFinanceiro(params, associado, transaction)
  }

  calculaValorMensalidade(valorMensalidade: number, gpPagto: number, pagamentoUnico) {
    return gpPagto == GrupoPagamento.BOLETO && pagamentoUnico ? valorMensalidade * 12 : valorMensalidade;
  }

  calculaNumeroVidas(quantidadeVidas: number, dependentes: number) {
    return quantidadeVidas + (dependentes || 0);
  }

  calcularDataExpiracao(params: any): DateTime {
    switch(params.formaPagamento.gpPagto) {
      case GrupoPagamento.CARTAO_CREDITO: 
        return DateTime.now().plus({ days: 7 })
      case GrupoPagamento.DEBITO_EM_CONTA:
        if (params.chkPrimeiraBoleto) {
          return DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy")
        } else {
          return DateTime.fromFormat(params.vencimentoDebito, "dd/MM/yyyy")
        }

      case GrupoPagamento.BOLETO:
        return DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy")
        
      case GrupoPagamento.CONSIGNADO: 
        if (params.chkPrimeiraBoleto) {
          return DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy");
        } else {
          return DateTime.fromFormat(params.vencimentoConsignado, "dd/MM/yyyy");
        }

      default:
        throw new FormaPagamentoNaoEncontrada();
    }
  }
}

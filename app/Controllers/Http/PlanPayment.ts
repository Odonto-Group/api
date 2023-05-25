import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import TokenService from 'App/Services/TokenService';
import AssociadoService from 'App/Services/AssociadoService';
import AssociadoComPlanoJaCadastrado from 'App/Exceptions/AssociadoComPlanoJaCadastrado';
import TokenVazioException from 'App/Exceptions/TokenVazioException';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import FormasPagamentoService from 'App/Services/FormasPagamentoService';
import { DateTime } from 'luxon';
import UfService from 'App/Services/UfService';
import TbUf from 'App/Models/TbUf';
import TbFormasPagamento from 'App/Models/TbFormasPagamento';
import TbAssociado from 'App/Models/TbAssociado';
import ResponsavelFinanceiroService from 'App/Services/ResponsavelFinanceiroService';
import DependenteService from 'App/Services/DependenteService';
import DocumentService from 'App/Services/DocumentService';
import Drive from '@ioc:Adonis/Core/Drive'
import path from 'path'


@inject()
export default class PlanPayment {

  constructor(private tokenService: TokenService
      , private associadoService: AssociadoService
      , private formasPagamentoService: FormasPagamentoService
      , private ufService: UfService
      , private responsavelFinanceiroService: ResponsavelFinanceiroService
      , private dependenteService: DependenteService
      , private documentService: DocumentService) {} 

  async index({ request, response }: HttpContextContract) {
    const token = request.header('Authorization')?.replace('Bearer ', '');
    const params = request.all()

    if(!token) {
        throw new TokenVazioException();
    }

    const tokenIdParc = await this.tokenService.findParceiro(token);
    const parceiro = tokenIdParc.parceiro
    const produtoComercial = parceiro.produtoComercialParceiro
   
    //verifica se produto faz parte da assefaz?

    const associado = await this.associadoService.findAssociado(params.nu_cpf);

    if (associado.cd_status != 0) {
        throw new AssociadoComPlanoJaCadastrado();
    }

    const formaPagamento = await this.formasPagamentoService.findFormaPagamento(produtoComercial.id_prodcomerc, params.idBanco, params.formaPagamento)
    
    if (!formaPagamento) {
      throw new FormaPagamentoNaoEncontrada();
    }

    let dataExpiracao = this.calcularDataExpiracao(params);
    let dataAgora = DateTime.local();

    let diasParaExpirar = dataAgora.diff(dataExpiracao).plus(1);

    let valorMensalidade = this.calculaPagamentoUnico(formaPagamento.vl_valor, params.formaPagamento.gpPagto, formaPagamento.nu_PagUnico);

    let quantidadeVidas = this.calculaNumeroVidas(1, params.nome_dependente);
    
    const valorContrato = valorMensalidade * quantidadeVidas;
  
    const uf = await this.ufService.findUfBySigla(params.uf)

    this.salvarAssociado(associado, params, uf, formaPagamento, valorContrato, dataExpiracao)

    this.responsavelFinanceiroService.deleteResponsavelFinanceiroByIdAssociado(associado.id_associado)

    this.saveResponsavelFinanceiro(params, uf, associado);

    this.saveDependentes(params, associado);

    this.saveDocuments(params, associado); //pular


  }

  saveDocuments(params: any, associado: TbAssociado) {
    params.docs && params.docs.forEach(doc => {
        if (doc.isValid) {
          const path = this.documentService.uploadImage(doc, associado.id_associado);
          
          const storagePath = Drive.disk('local').get(path);
        }
    });
  }

  saveDependentes(params: any, associado: TbAssociado) {
      params.nome_dependente && params.nome_dependente.forEach(resp => {
        this.dependenteService.saveDependente(resp, associado)
      });
  }

  saveResponsavelFinanceiro(params:any, uf: TbUf, associado: TbAssociado) {
    params.chkResp ? 
      this.responsavelFinanceiroService.saveResponsavelFinanceiroByAssociado(params, associado, uf)
      : this.responsavelFinanceiroService.saveResponsavelFinanceiro(params, associado)
  }

  salvarAssociado(associado: TbAssociado, params: any, uf: TbUf, formaPagamento: TbFormasPagamento, valorContrato: number, dataExpiracao: DateTime) {
    const dadosAssociado = this.associadoService.buildAssociado(params, uf, formaPagamento, valorContrato, dataExpiracao);
    
    this.associadoService.saveAssociado(associado, dadosAssociado);
  }

  calculaPagamentoUnico(valorMensalidade: number, gpPagto: number, pagamentoUnico) {
    return gpPagto == 3 && pagamentoUnico ? valorMensalidade * 12 : valorMensalidade;
  }

  calculaNumeroVidas(quantidadeVidas: number, nome_dependente: []) {
    return quantidadeVidas + (nome_dependente && nome_dependente.length || 0);
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

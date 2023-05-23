import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import TokenService from 'App/Services/TokenService';
import AssociadoService from 'App/Services/AssociadoService';
import AssociadoComPlanoJaCadastrado from 'App/Exceptions/AssociadoComPlanoJaCadastrado';
import TokenVazioException from 'App/Exceptions/TokenVazioException';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import FormasPagamentoService from 'App/Services/FormasPagamentoService'
import { DateTime } from 'luxon';
import UfService from 'App/Services/UfService';

@inject()
export default class PlanPayment {

  private tokenService: TokenService;
  private associadoService: AssociadoService;
  private formasPagamentoService : FormasPagamentoService;
  private ufService : UfService;

  constructor(tokenService: TokenService, associadoService: AssociadoService, formasPagamentoService : FormasPagamentoService, ufService : UfService) {
     this.tokenService = tokenService;
     this.associadoService = associadoService;
     this.formasPagamentoService = formasPagamentoService;
     this.ufService = ufService;
  }

  async index({ request, response }: HttpContextContract) {
    // const token = request.header('Authorization')?.replace('Bearer ', '');
    // const params = request.all()

    // if(!token) {
    //     throw new TokenVazioException();
    // }

    const parceiro = await this.tokenService.findParceiro('E76YNq4');
   
    return parceiro
    // //verifica se produto faz parte da assefaz?

    // const associado = await this.associadoService.findAssociado(params.nu_cpf);

    // if (associado.cd_status != 0) {
    //     throw new AssociadoComPlanoJaCadastrado();
    // }

    // const formaPagamento = await this.formasPagamentoService.findFormaPagamento(produtoComercial.id_prodcomerc, params.idBanco, params.formaPagamento)
    
    // if (!formaPagamento) {
    //   throw new FormaPagamentoNaoEncontrada();
    // }

    // let dataExpiracao = this.calcularDataExpiracao(params);
    // let dataAgora = DateTime.local();

    // let diasParaExpirar = dataAgora.diff(dataExpiracao).plus(1);

    // let valorMensalidade = formaPagamento.vl_valor;

    // this.calculaPagamentoUnico(valorMensalidade, params.formaPagamento.gpPagto, formaPagamento.nu_PagUnico);

    // const numeroProposta = Math.random();
    // let quantidadeVidas = 1;

    // this.calculaNumeroVidas(quantidadeVidas, params.nome_dependente);
    
    // const valorContrato = valorMensalidade * quantidadeVidas;
    
    // const uf = await this.ufService.findUfBySigla(params.uf)

    // const dadosAssociado = this.construirDadosAssociado(params);
  }

  // calculaPagamentoUnico(valorMensalidade: number, gpPagto: number, pagamentoUnico) {
  //   valorMensalidade = gpPagto == 1 ? valorMensalidade * 12 : valorMensalidade;
  // }

  // calculaNumeroVidas(quantidadeVidas: number, nome_dependente: []) {
  //   quantidadeVidas += nome_dependente && nome_dependente.length;
  // }

  // calcularDataExpiracao(params: any): DateTime {
  //   switch(params.formaPagamento.gpPagto) {
  //     case 1: 
  //       return DateTime.local().plus({ days: 7 })

  //     case 2:
  //       if (params.chkPrimeiraBoleto) {
  //         return DateTime.local();
  //       } else {
  //         return DateTime.fromFormat(params.vencimentoDebito ? params.vencimentoDebito : params.vencimentoBoleto, "yyyy/mm/dd")
  //       }

  //     case 3:
  //       return DateTime.fromFormat(params.vencimentoBoleto, "yyyy/mm/dd");
        
  //     case 4: 
  //       if (params.chkPrimeiraBoleto) {
  //         return DateTime.fromFormat(params.vencimentoBoleto, "yyyy/mm/dd");
  //       }
  //       else {
  //         return DateTime.fromFormat(params.vencimentoConsignado, "yyyy/mm/dd");
  //       }

  //     default:
  //       throw new FormaPagamentoNaoEncontrada();
  //   }
  // }

  // construirDadosAssociado(params: any): any {
  //   const dadosAssociado = {};
  //     dadosAssociado['nm_associado'] = params.nome_titular
  //     dadosAssociado['nu_cpf'] = params.cpf
  //     dadosAssociado['nm_mae'] = params.nm_mae;
  //     dadosAssociado['nu_cns'] = params.cns;
  //     dadosAssociado['nu_rg'] = params.rg;

  //     dadosAssociado['dt_nasc'] = params.data_nascimento;
  //     dadosAssociado['ds_email'] = params.email_titular;
  //     dadosAssociado['id_sexo_a'] = params.sexo;

  //     dadosAssociado['id_EstadoCivil_a'] = params.estado_civil;

  //       $associado->setCelularAttribute(params.celular);
  //       $associado->setOrgaoExpedidor(params.['orgao_expedidor'], params.['orgao_expedidor_uf']);

  //     dadosAssociado['id_FontePag_a'] = params.fonte_pagadora || null;
  //     dadosAssociado['id_orgao_a'] = params.orgao || null;
  //     dadosAssociado['cd_perfil'] = params.perfil || null;
  //     dadosAssociado['nu_MatriculaFuncional'] = params.matricula || null;
  //     dadosAssociado['tx_Cargo'] = params.cargo || null;

  //     dadosAssociado['dt_operacao'] = DateTime.local().toFormat('f');
  //     dadosAssociado['dt_Cadastro'] = DateTime.local().toFormat('f');
  //     dadosAssociado['dt_alteraStatus'] = DateTime.local().toFormat('dd/mm/yyyy');

  //     dadosAssociado['id_parentesco_a'] = 1;
  //     dadosAssociado['nu_CEP'] = params.['cep'];
  //     dadosAssociado['tx_EndLograd'] = strtoupper(params.['endereco']);
  //     dadosAssociado['nu_EndNumero'] = params.['numero_casa'];
  //     dadosAssociado['tx_EndCompl'] = strtoupper(params.['complemento']) || "";
  //     dadosAssociado['tx_EndBairro'] = strtoupper(params.['bairro']);
  //     dadosAssociado['tx_EndCidade'] = strtoupper(params.['cidade']);
  //     dadosAssociado['id_UF_a'] = $idUF->id_uf;

  //     dadosAssociado['id_origemVenda'] = 99;

  //     dadosAssociado['id_vendedor_a'] = !empty($_COOKIE['corretor']) ? base64_decode($_COOKIE['corretor']) : (isset($returnToken->vendedor->id_vendedor) ? $returnToken->vendedor->id_vendedor : 65083);
  //     dadosAssociado['cd_CodContratoS4E'] = $dadosPagamentoProduto->cd_CodContratoS4E;

  //     dadosAssociado['dt_dia_vencto'] = date('d');
  //     dadosAssociado['nu_vl_mensalidade'] = $valorContrato;

  //     dadosAssociado['id_meiopagto_a'] = $gpPagto;
  //     dadosAssociado['dt_dataprimvenc'] = $dataE;
  //     dadosAssociado['dt_inicio_vigencia'] = date('d/m/Y');
  //     dadosAssociado['cd_status'] = 0;
  //     dadosAssociado['st_mail'] = 0;
  // }

}

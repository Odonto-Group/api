import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import { Category } from 'App/Enums/Category';
import PlanService from 'App/Services/PlanService';
import TokenService from 'App/Services/TokenService';
import CarenciaProdutoService from 'App/Services/CarenciaProdutoService';
import { DateTime } from 'luxon';
import TbOrgao from 'App/Models/TbOrgao';
import TbFontePagadora from 'App/Models/TbFontePagadora';
import TbPerfilServidor from 'App/Models/TbPerfilServidor';
import TbUf from 'App/Models/TbUf';
import TbSexo from 'App/Models/TbSexo';
import TbBanco from 'App/Models/TbBanco';
import TbParentesco from 'App/Models/TbParentesco';
import TbEstadoCivil from 'App/Models/TbEstadoCivil';
import TbOrgaoExpedidor from 'App/Models/TbOrgaoExpedidor';
import TokenInvalidoException from 'App/Exceptions/TokenInvalidoException';
import UfService from 'App/Services/UfService';
import UfInvalidoException from 'App/Exceptions/UfInvalidoException';
import VendedorNaoEncontradoException from 'App/Exceptions/VendedorNaoEncontradoException';
//import { encryptData } from 'App/utils/cryptoUtils';

@inject()
export default class CompanyPlanController {

  constructor(
    private planService: PlanService,
    private tokenService: TokenService,
    private carenciaProdutoService: CarenciaProdutoService,
    private ufService: UfService
    ) {}

  async index({ params }: HttpContextContract) {
    const token = params.token;
    const state = params.state;

    await this.validaToken(token)

    if(state && await this.ufService.isUFValido(state)) {
      throw new UfInvalidoException()
    }

    let plan;

    if (token) {
      plan = await this.planService.getPlanWithTokenCompany(state, token, [Category.PME_2_29_VIDAS, Category.PME_30_199_VIDAS])
    } else {
      plan = await this.planService.getBasicPlanCompany(state, [Category.PME_2_29_VIDAS, Category.PME_30_199_VIDAS])
    }
    
    return {
      valor: plan.produtoComercial.formasPagamentoEmpresa[0].vl_valor
    }
  }
  
  async getPlanDetails({ request, response }: HttpContextContract) {
    const token = request.params().token

    await this.validaToken(token)

    const tokenBanco = await this.tokenService.findTokenParceiroEmpresa(token)

    const carencias = await this.carenciaProdutoService.buscarCarencia(tokenBanco.parceiro.produtoComercial.id_prodcomerc)

    if (tokenBanco.vendedor === null) {
      throw new VendedorNaoEncontradoException()
    }

    // let especialidades = [] as any //tokenBanco.parceiro.produtoComercial.id_ProdutoS4E_c para a query no s4e

    let liste = [] as any ;
    let arrGeral = [] as any;

    // especialidades.forEach(especialidade => {
    //   if (liste.findIndex(item => item.espec === especialidade.cd_especialidade) === -1) {
    //     liste.push({
    //       espec: especialidade.cd_especialidade,
    //       nm: especialidade.nome_especialidade,
    //       slug: cleanString(utf8_encode(especialidade.nome_especialidade))
    //     });
    //   }
    //   arrGeral.push(especialidade);
    // });

    let formasPagamento = {} as any

    tokenBanco.parceiro.produtoComercial.formasPagamentoEmpresa.forEach(pagamento => {
      let cdMeioPagto = pagamento.meioPagamentoEmpresa.cd_gmeiopagto
      let pag = {} as any
      let arrayPag = [] as any
      

      if (formasPagamento.cdMeioPagto == null) {
        switch(cdMeioPagto) {
          case 1:
            pag.nome = "Cartão de Crédito";
            pag.slug = "pgtoCartao";
            pag.meioPagamaneto = pagamento.id_meiopagto_fc
            arrayPag[pagamento.id_meiopagto_fc] = {vl_fp: pagamento.vl_valor}
  
            break
          case 2:
            pag.nome = "Débito em conta";
            pag.slug = "pgtoDebito";
            pag.meioPagamaneto = pagamento.id_meiopagto_fc
            arrayPag[pagamento.id_meiopagto_fc] = {vl_fp: pagamento.vl_valor}
  
            break
          case 3:
            if (pagamento.nu_PagUnico == 0) {
              pag.nome = "Boleto Bancário"; 
              pag.slug = "pgtoBoleto";
              pag.meioPagamaneto = pagamento.id_meiopagto_fc
              pag.vl_valor = pagamento.vl_valor
              arrayPag[pagamento.id_meiopagto_fc] = {vl_fp: pagamento.vl_valor}
            } else {
              pag.nome = "Boleto Bancário"; 
              pag.slug = "pgtoBoleto";
              pag.meioPagamaneto = pagamento.id_meiopagto_fc
              pag.valorCheio = pagamento.vl_valor * 12
              arrayPag[pagamento.id_meiopagto_fc] = {vl_fp: pagamento.vl_valor}
            }
  
            break
  
          case 4:
            pag.nome = "Consignado";
            pag.slug = "pgtoConsignado";
            pag.meioPagamaneto = pagamento.id_meiopagto_fc
            const dia = DateTime.now().day
  
            if (dia < 5) {
              pag.data_vigencia_final = DateTime.now().set({ day: 1 }).toFormat('yyyy/MM/dd');
            } else {
              const currentDate = DateTime.local();
              const nextMonthDate = currentDate.plus({ months: 1 }).startOf('month');
  
              pag.data_vigencia_final = nextMonthDate.toFormat('yyyy/MM/dd');
            }
  
            break
  
          case 5:
            pag.nome = "Fatura";
            pag.slug = "pgtoFatura";
            pag.meioPagamaneto = pagamento.id_meiopagto_fc
  
            break
  
          default:
            pag.nome = "";
            pag.slug = "";
            pag.meioPagamaneto = ""
            break
        }
        formasPagamento[cdMeioPagto || 0] = {
          'idPgto': pag.meioPagamaneto,
          'gmeioPagto': cdMeioPagto,
          'nm_forma': pag.nome,
          'valor': pag.valorCheio || pag.vl_valor,
          'slug': pag.slug,
          'dataVigenciaFinal': pag.data_vigencia_final ?? null
        }
      } 
    })

      let equipe;
      let agencia;
      let promotor;
      let angariador;
      const produtoComercial = tokenBanco.parceiro.produtoComercial
      let confirma = false; 

    //   if (produtoComercial) {
    //     if ([751, 752, 753, 754].includes(produtoComercial.id_prodcomerc)) {
    //       equipe = await TbEquipe.query();
    //       agencia = await TbAgencia.query();
    //       promotor = await TbPromotor.query();
    //       angariador = await TbAngariador.query();
    //   }

    //   const produtosAssefaz = Env.get('ADESAO_PRODUTOS_ASSEFAZ')?.split(',');
    
    //   if (produtosAssefaz?.includes(produtoComercial.id_prodcomerc)) {
    //       confirma = true;
    //   }
    // }
    
    let orgaos = [] as TbOrgao[]
    let perfils = [] as TbPerfilServidor[]
    let fontePagadora = [] as TbFontePagadora[]

    if(tokenBanco.parceiro.produtoComercial.categoria.id_categoria != 2) {
      orgaos = await TbOrgao.query();
      perfils = await TbPerfilServidor.query();
      fontePagadora = await TbFontePagadora.query();
    }

    let ufs = [] as TbUf[] ;
    let listaSexos = [] as TbSexo[];
    let listaBancos = [] as TbBanco[];
    let listaParentesco = [] as TbParentesco[];
    let listaEstadoCivil = [] as TbEstadoCivil[];
    let listaOrgaoExpedidor = [] as TbOrgaoExpedidor[];
 
    await Promise.all([
     TbUf.query(),
     TbSexo.query(),
     TbBanco.query(),
     TbParentesco.query().where('nu_UsoTipoPlan', 2),
     TbEstadoCivil.query(),
     TbOrgaoExpedidor.query()
    ])
      .then(results => {
        ufs = results[0]
        listaSexos = results[1];
        listaBancos = results[2];
        listaParentesco = results[3];
        listaEstadoCivil = results[4];
        listaOrgaoExpedidor = results[5];
    })
    

    let dataVencimento = this.criarDataVencimento()

    const responseData = {
      type: 'bussiness',
      produtoComercial: produtoComercial,
      vendedor: tokenBanco?.vendedor?.tx_nome,
      corretora: tokenBanco.corretora,
      parceiro: tokenBanco.parceiro,
      formasPagamento: tokenBanco.parceiro.produtoComercial.formasPagamentoEmpresa,
      listaFormaPagamentos: formasPagamento,
      equipes: equipe,
      angariadores: angariador,
      promotores: promotor,
      agencias: agencia,
      categoria: tokenBanco.parceiro.produtoComercial.categoria,
      listaUFS: ufs,
      vendedorPN: tokenBanco?.vendedor?.tx_nome?.split(" ")[0],
      listaOrgaosExpedidor: listaOrgaoExpedidor,
      listaSexos: listaSexos,
      listaEstadosCivil: listaEstadoCivil,
      orgaos: orgaos,
      perfis: perfils,
      fontePagamentos: fontePagadora,
      listaParentescos: listaParentesco,
      token: token,
      listaEspec: liste, 
      arrGeral: arrGeral,
      vencimentoBoletos: dataVencimento,
      bancos: listaBancos,
      carencias: carencias
    };

    // Criptografando a resposta
    //const encryptedResponse = encryptData(JSON.stringify(responseData));

    // Enviando a resposta criptografada para a aplicação
    //return response.json({data: encryptedResponse });
    return response.json({data: responseData });
  }

  criarDataVencimento() {
    let datas = [] as any;
    let todayIm = DateTime.local().toFormat('yyyy-MM-dd');
    let nextValue = DateTime.local().plus({ days: 1 }).toFormat('yyyy-MM-dd');
    let nextSelect = DateTime.local().plus({ days: 1 }).toFormat('yyyy/MM/dd');

    let month = DateTime.local().month;
    let year = DateTime.local().year;

    let i = 0;
    let dia = 5;
    do {
      let dtValue = DateTime.local(year, month, dia).toFormat('yyyy-MM-dd');
      let dtSelect = DateTime.local(year, month, dia).toFormat('yyyy/MM/dd');

      datas[i] = { value: dtValue, select: dtSelect };

      dia += 5;
      i++;
    } while (dia < 30);

    dia = 5;
    do {
      let dtValue = DateTime.local(year, month, dia).plus({ months: 1 }).toFormat('yyyy-MM-dd');
      let dtSelect = DateTime.local(year, month, dia).plus({ months: 1 }).toFormat('yyyy/MM/dd');

      datas[i] = { value: dtValue, select: dtSelect };

      dia += 5;
      i++;
    } while (dia < 30);

    let expiryDates = datas.filter(data => data.value > todayIm).slice(0, 3);

    expiryDates.unshift({ value: nextValue, select: nextSelect });

    return expiryDates;
  }

  extrairNomesVendedor(nomeCompletoVendedor: string) {
    let vendedorNomes = nomeCompletoVendedor.split(" ")   

    return {
      vendedorNome: vendedorNomes,
      vendedorPN: vendedorNomes[0]
    }
  }

  async validaToken(token: string) {
    if(token && !(await this.tokenService.isTokenValido(token))) {
      throw new TokenInvalidoException()
    }
  }
}

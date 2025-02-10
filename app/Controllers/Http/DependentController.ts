import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import S4EService from 'App/Services/S4EService';
import DependentValidator from 'App/Validators/DependentValidator';
import AssociadoService from 'App/Services/AssociadoService';
import PlanService from 'App/Services/PlanService';
import DependenteService from 'App/Services/DependenteService';
import Database from '@ioc:Adonis/Lucid/Database';
import FormasPagamentoService from 'App/Services/FormasPagamentoService';
import OrgaoService from 'App/Services/OrgaoService';
import UfService from 'App/Services/UfService';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon';
import PagamentoConsignadoService from 'App/Services/PagamentoConsignado';
import LogService from 'App/Services/Log/Log';
import ResponsavelFinanceiroService from 'App/Services/ResponsavelFinanceiroService';
import formatNumberBrValue from "App/utils/FormatNumber";
import AdesaoEmailContent from 'App/interfaces/AdesaoEmailContent.interface';
import { MailSenderService } from 'App/Services/MailSenderService';

@inject()
export default class DependentController {
  private emailDefault = Env.get('EMAIL_ENVIO_DEFAULT')
  constructor(
    private readonly S4eService: S4EService,
    private readonly associadoService: AssociadoService,
    private readonly planoService: PlanService,
    private readonly dependenteService: DependenteService,
    private readonly orgaoService: OrgaoService,
    private readonly ufService: UfService,
    private pagamentoConsignadoService: PagamentoConsignadoService,
    private readonly logService: LogService,
    private mailSenderService: MailSenderService,
    private readonly responsavelFinanceiroService: ResponsavelFinanceiroService,
    private readonly formasPagamentoService: FormasPagamentoService
  ) { }

  async index({ request, response }: HttpContextContract) {
    
    const formatarData = (dataString) => {
      const [mes, dia, ano] = dataString.split(" ")[0].split("/");
      return `${dia}/${mes}/${ano}`;
    };
    const formatarData2 = (dataString) => {
      const [ano, mes, dia] = dataString.split("-");

      return `${dia}/${mes}/${ano}`;
    };
    const formatarVencimento = (dataString) => {
      const data = new Date(dataString);
      data.setMonth(data.getMonth() + 1);

      return data;
    };
    
    const params = await request.validate(DependentValidator);
    const tipoRequisicao = 'Pagamento';
    const Id = String(params.dados.responsavelFinanceiro.codigo);
    this.logService.writeLog(Id, tipoRequisicao, { local:'Dependents', type: 'entrada', data: params });

    const associadoS4e = await this.S4eService.getAssociadoById(params.dados.responsavelFinanceiro.codigo);
    if(associadoS4e){
      const Dependentes = params.dados.dependente;
      if(!Dependentes){
        throw new Error('dependentes devem ser cadastrados!!!');
      }

      await this.S4eService.includeDependents(params);
      
      const associado = await this.associadoService.findAssociadoByCpf(associadoS4e.cpf);
      
      const titular = associadoS4e.dependentes.find(x => x.codigoGrauParentesco == 1);
      const dependentesS4E = associadoS4e.dependentes.filter(x => x.codigoGrauParentesco != 1);
      const valorTotal = associadoS4e.dependentes.map(dep => parseFloat(dep.valorPlano.replace("R$ ", "").replace(",", "."))).reduce((acc, val) => acc + val, 0);
      const produtoComercial = await this.planoService.getPlansbys4eId(titular.codigoVendedor, titular.codigoPlano);
      const vencimento = formatarVencimento(associadoS4e.dataDeAssinaturaDoContrato);
      await Database.transaction(async (transaction) => {
        try{
          if (associado.id_associado) {
            const newPagamento = {
              gpPagto: 4,
              idPagto: 3
            }
           
            const formaPagamento = await this.formasPagamentoService.findFormaPagamentoIndividual(produtoComercial.id_prodcomerc, 1, newPagamento);
            if (!formaPagamento) {
              throw new FormaPagamentoNaoEncontrada();
            }
            const orgao = await this.orgaoService.getOrgaoWithS4eCodOrgao(associadoS4e.codigoDepartamento);
            const email = associadoS4e.contatos.find(x => x.tipo == 'E-mail');
            const celular = associadoS4e.contatos.find(x => x.tipo == 'Celular');
            const idUf = await this.ufService.findUfBySigla(associadoS4e.ufSigla);            
            const newParam = {
              nomeTitular: associadoS4e.nome,
              cpf: associadoS4e.cpf,
              rg: associadoS4e.rg,
              nomeMae: titular.nomeMaeDependente,
              dataNascimento: formatarData(associadoS4e.dataDeNascimento),
              emailTitular: email ? email.descricaoContato : '',
              celular: celular ? celular.descricaoContato : '',
              idSexo: titular.sexo == 'M' ? 2 : 1,
              idEstadoCivil: 1,
              idFontePagadora: 5,
              orgao: orgao.id_orgao,
              perfil: 5,
              matricula: associadoS4e.matricula,
              cargo: '',
              cep: associadoS4e.cep,
              endereco: associadoS4e.logradouro,
              numeroCasa: associadoS4e.numero,
              complemento: associadoS4e.complemento,
              bairro: associadoS4e.bairro,
              cidade: associadoS4e.cidade,
              idUf: idUf.id_uf,
              formaPagamento:newPagamento,
              idOrgaoExpedidor: 63,
              idOrgaoExpedidorUf: 8
            }
            await this.associadoService.buildAssociado(associado, newParam, formaPagamento, valorTotal, DateTime.fromJSDate(vencimento), produtoComercial.id_vendedor, false, transaction )
            const newRF = {
              responsavelFinanceiro:{
                cpf: newParam.cpf,
                nome: newParam.nomeTitular,
                dataNascimento: newParam.dataNascimento,
                email: newParam.emailTitular,
                cep: newParam.cep,
                endereco: newParam.endereco,
                numero: newParam.numeroCasa,
                complemento: newParam.complemento,
                bairro: newParam.bairro,
                cidade: newParam.cidade,
                idUf: idUf.id_uf,
                telefone: newParam.celular
              }
            }
            await this.responsavelFinanceiroService.saveResponsavelFinanceiro(newRF, associado, transaction)
            associado.$extras.dt_Cadastro = DateTime.fromFormat(formatarData(associadoS4e.dataDeAssinaturaDoContrato), "dd/MM/yyyy").toString();
            const pagamento = {
              compraValor: valorTotal,
              orgao: orgao.id_orgao,
              fontePgd: 5,
              perfil: 4,
              vinculo: 1,
              Desc_cargo: '',
              matricula: associadoS4e.matricula              
          };
          
            await this.pagamentoConsignadoService.savePagamento(associado, pagamento, DateTime.fromJSDate(vencimento), transaction);
            for (const dependente of dependentesS4E) {
              const newDependent = {
                nome: dependente.nomeDependente,
                cpf: dependente.numeroCpfDependente,
                dataNascimento: formatarData(dependente.dataNascimento),
                nomeMae: dependente.nomeMaeDependente,
                idSexo: dependente.sexo === 'M' ? 2 : 1,
                idParentesco: dependente.codigoGrauParentesco == 3 ? 10 : 11,
                idOrgaoExpedidor: 63,
                idOrgaoExpedidorUf: 8
              }; 
            
              await this.dependenteService.saveDependente(newDependent, associado, transaction);
            }
          } 
          const link = 'https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/1/' + associado.id_associado;
          const dataCadastro = associado.$extras.dt_Cadastro;
          const proposta = associado.nr_proposta;

          for (const dependente of Dependentes) {
            const newDependent = {
              nome: dependente.nome,
              cpf: dependente.cpf,
              dataNascimento: formatarData2(dependente.dataNascimento),
              nomeMae: dependente.nomeMae,
              idSexo: dependente.sexo === 1 ? 2 : 1,
              idParentesco: dependente.tipo == 3 ? 10 : 11,
              idOrgaoExpedidor: 63,
              idOrgaoExpedidorUf: 8
            };
          
            await this.dependenteService.saveDependente(newDependent, associado, transaction);
          }
          const ValorDependente = Dependentes.map(dep => parseFloat(dep.planoValor.replace("R$ ", "").replace(",", "."))).reduce((acc, val) => acc + val, 0);
          associado.nu_vl_mensalidade = valorTotal + ValorDependente;
          await associado.save();
          transaction.commit();

          const celular = associado.nu_dddCel + ( associado.nu_Celular ?  associado.nu_Celular :  associado.$extras.nu_Celular );

          const planoContent = { 
            NOMEPLANO: produtoComercial.nm_prodcomerc,
            DATAVENCIMENTO: DateTime.fromJSDate(vencimento).toFormat('dd/MM/yyyy'),
            NOMECLIENTE: associado.nm_associado,
            LINKPAGAMENTO: String(associado.id_associado),
            VALORPLANO: formatNumberBrValue(associado.nu_vl_mensalidade),
            METODOPAGAMENTO: 'Consignado'
          } as AdesaoEmailContent;

          const produtosDependentes:number[] = [];

          function getPlan(dependentePlano: number): number {
            switch (dependentePlano) {
              case 119:
                return 994;
              case 252:
                return 998;
              case 206:
                return 999;
              case 261:
                return 1000;
              default:
                return 994;
            }
          }
          
          function processDependentes(dependentes: any[], titularPlano: number) {
            for (const dependente of dependentes) {
              if (titularPlano == 124) {
                const plan = getPlan(dependente.plano || dependente.codigoPlano);
                if (!produtosDependentes.includes(plan)) {
                  produtosDependentes.push(plan);
                }
              }
            }
          }
          
          processDependentes(Dependentes, titular.codigoPlano);
          processDependentes(dependentesS4E, titular.codigoPlano);
        
          await this.mailSenderService.sendEmailAdesaoConsignado(this.emailDefault || associado.ds_email, 'Bem-vindo à OdontoGroup.', associado.id_prodcomerc_a, produtosDependentes, planoContent)

          const resposta = {
            linkProposta: link,
            numeroProposta: proposta,
            dataCadastro: dataCadastro,
            dataVencimento: params.dados.responsavelFinanceiro.dataAssinaturaContrato,
            nomeVendedor: produtoComercial.tx_nome,
            nome: associado.nm_associado,
            email: associado.ds_email,
            ddd: associado.nu_dddCel,
            telefone: celular,
            nomePlano: produtoComercial.nm_prodcomerc,
            quantidadeVidas: associadoS4e.dependentes.length,
            valorPagamento: ValorDependente,
            paymentStatus: 2,
            formaPagamento: 'Consignado',
            grupoPagamento: 4,
            linkPagamento: 'Sem Link',
          }
          return response.json(resposta);
        } catch (error) {
          this.logService.writeLog(Id, tipoRequisicao, { local:'Dependents', type: 'Erro', data: error.message });
          transaction.rollback();
        }
      })
      
    } else {
      this.logService.writeLog(Id, tipoRequisicao, { local:'Dependents', type: 'entrada', data: 'Associado não localizado no S4e' });
      throw Error('Associado não localizado no S4e;')
    }
  }
}

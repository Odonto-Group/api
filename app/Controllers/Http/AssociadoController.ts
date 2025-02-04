import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import S4EService from 'App/Services/S4EService';
import AssociadoService from 'App/Services/AssociadoService';
import PlanService from 'App/Services/PlanService';
import DependenteService from 'App/Services/DependenteService';
import Database from '@ioc:Adonis/Lucid/Database';
import FormasPagamentoService from 'App/Services/FormasPagamentoService';
import OrgaoService from 'App/Services/OrgaoService';
import UfService from 'App/Services/UfService';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import { DateTime } from 'luxon';
import PagamentoConsignadoService from 'App/Services/PagamentoConsignado';
import LogService from 'App/Services/Log/Log';
import ResponsavelFinanceiroService from 'App/Services/ResponsavelFinanceiroService';

@inject()
export default class AssociadoController {
  constructor(
    private readonly S4eService: S4EService,
    private readonly associadoService: AssociadoService,
    private readonly planoService: PlanService,
    private readonly dependenteService: DependenteService,
    private readonly orgaoService: OrgaoService,
    private readonly ufService: UfService,
    private pagamentoConsignadoService: PagamentoConsignadoService,
    private readonly logService: LogService,
    private readonly responsavelFinanceiroService: ResponsavelFinanceiroService,
    private readonly formasPagamentoService: FormasPagamentoService
  ) { }

  async index({ request, response }: HttpContextContract) {
    
    const formatarData = (dataString) => {
      const [mes, dia, ano] = dataString.split(" ")[0].split("/");
      return `${dia}/${mes}/${ano}`;
    };
    const formatarVencimento = (dataString) => {
      const data = new Date(dataString);
      data.setMonth(data.getMonth() + 1);

      return data;
    };
    
    const params = request.all();
    const tipoRequisicao = 'GetAssociado';
    const Id = String(params.cpf);
    this.logService.writeLog(Id, tipoRequisicao, { local:'Associado', type: 'entrada', data: params });
    const associadoS4e = await this.S4eService.getAssociadoByCpfGDF(params.cpf);
    if(associadoS4e){
      const associado = await this.associadoService.findAssociadoByCpf(associadoS4e.cpf);
      
      const titular = associadoS4e.dependentes.find(x => x.codigoGrauParentesco == 1);
      const dependentesS4E = associadoS4e.dependentes.filter(x => x.codigoGrauParentesco != 1);
      const produtoComercial = await this.planoService.getPlansbys4eId(titular.codigoVendedor, titular.codigoPlano);
      const vencimento = formatarVencimento(associadoS4e.dataDeAssinaturaDoContrato);
      await Database.transaction(async (transaction) => {
        try{
          if (!associado.id_associado) {
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
            const celular = associadoS4e.contatos.find(x => x.tipo == 'Celular')
            const idUf = await this.ufService.findUfBySigla(associadoS4e.ufSigla);
            console.log('idUf: ', idUf);
            const valorTotal = associadoS4e.dependentes.map(dep => parseFloat(dep.valorPlano.replace("R$ ", "").replace(",", "."))).reduce((acc, val) => acc + val, 0);
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
            console.log('newRF: ', newRF);
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
            if (dependentesS4E.length > 0) {
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
          } 
          const link = 'https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/1/' + associado.id_associado;
          const dataCadastro = associado.$extras.dt_Cadastro;
          const proposta = associado.nr_proposta;

          transaction.commit();
          

          const celular = associado.nu_dddCel + (associado.nu_Celular ? associado.nu_Celular : associado.$extras.nu_Celular);
          const resposta = {
            linkProposta: link,
            numeroProposta: proposta,
            dataCadastro: dataCadastro,
            dataVencimento: vencimento.toDateString(),
            nomeVendedor: produtoComercial.tx_nome,
            nome: associado.nm_associado,
            email: associado.ds_email,
            ddd: associado.nu_dddCel,
            telefone: celular,
            nomePlano: produtoComercial.nm_prodcomerc,
            quantidadeVidas: associadoS4e.dependentes.length,
            valorPagamento: associado.nu_vl_mensalidade,
            paymentStatus: 2,
            formaPagamento: 'Consignado',
            grupoPagamento: 4,
            linkPagamento: 'Sem Link',
          }
          console.log('retorno: ', resposta);
          return response.json(resposta);
        } catch (error) {
          console.log('error: ', error);
          this.logService.writeLog(Id, tipoRequisicao, { local:'Associado', type: 'Erro', data: error.message });
          transaction.rollback();
        }
      })
      
    } else {
      this.logService.writeLog(Id, tipoRequisicao, { local:'Associado', type: 'Erro', data: 'Associado não localizado no S4e' });
      throw Error('Associado não localizado no S4e;')
    }
  }
}

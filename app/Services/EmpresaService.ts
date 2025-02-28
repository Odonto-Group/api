import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbEmpresa from "App/Models/TbEmpresa";
import TbFormasPagamentoIndividual from "App/Models/TbFormasPagamentoIndividual";
import TbProdutoComercial from "App/Models/TbProdutoComercial";
import gerarNumeroProposta from "App/utils/Proposta";
import { DateTime } from "luxon";

export default class EmpresaService {

    async saveEmpresa(empresa: TbEmpresa, params: any, valorContrato: number, dataExpiracao: DateTime, idVendedor: number, produtoComercial: TbProdutoComercial, transaction: TransactionClientContract) {
        empresa.cd_codcontratoS4E = produtoComercial.produtoS4E.nu_CodigoAnsS4E;
        empresa.nm_razao_social = params.empresa.razaoSocial;
        empresa.nm_nome_fantasia = params.empresa.nomeFantasia;
        empresa.nu_cnpj = params.empresa.cnpj;
        empresa.nu_inscricao_estadual = params.empresa.inscricalEstadual;
        empresa.nu_qtd_funcionarios = params.empresa.quantidadeFuncionarios;
        empresa.nm_responsavel = params.empresa.nomeResponsavel;
        empresa.nu_cpf_resp = params.empresa.cpfResponsavel;
        empresa.ds_email = params.empresa.email;
        empresa.nu_dddfixo1 = params.empresa.dddFixo;
        empresa.nu_telfixo1 = params.empresa.telefoneFixo;
        empresa.nu_dddcel = params.empresa.dddCelular;
        empresa.nu_celular = params.empresa.celular;
        empresa.DT_CADASTRO = DateTime.now().toString();
        empresa.id_vendedor_e = idVendedor;
        empresa.nu_diavencimento = dataExpiracao.day;
        empresa.id_prodcomerc_e = produtoComercial.id_prodcomerc;
        empresa.dt_dataprimvenc = dataExpiracao.toString();
        empresa.nu_CEP = params.empresa.cep;
        empresa.tx_EndLograd = params.empresa.logradouro;
        empresa.tx_EndNumero = params.empresa.numero;
        empresa.tx_EndCompl = params.empresa.complemento;
        empresa.tx_EndBairro = params.empresa.bairro;
        empresa.tx_EndCidade = params.empresa.cidade;
        empresa.id_UF_e = params.empresa.idUf;
        empresa.cd_status = 0;
        empresa.cd_patrocinio_e = params.empresa.idPatrocinio;
        empresa.nr_proposta = gerarNumeroProposta();
        empresa.id_origemVenda = 5;
        empresa.nu_vl_mensalidade = valorContrato;

        await empresa.useTransaction(transaction).save()
    }


    async buscarEmpresa(cnpj: string): Promise<TbEmpresa> {
        return await TbEmpresa.query()
            .where('nu_cnpj', cnpj)
            .first() || new TbEmpresa;
    }
    async buscarEmpresaById(id: number): Promise<TbEmpresa> {
        return await TbEmpresa.query()
            .where('id_cdempresa', id)
            .preload('vendedor')
            .preload('produtoComercial', (query) => {
                query.preload('formasPagamentoEmpresa', (query => {
                  query.preload('meioPagamentoEmpresa')
                }))})
            .first() || new TbEmpresa;
    }

    async ativarPlanoEmpresa(empresa: TbEmpresa, transaction: TransactionClientContract, cdStatus: number) {
        await TbEmpresa.query()
          .where("id_cdempresa", empresa.id_cdempresa)
          .useTransaction(transaction)
          .update({cd_status: cdStatus})
      }
    async ativarPlanoEmpresaFull(empresa: TbEmpresa, cdStatus: number) {
        await TbEmpresa.query()
          .where("id_cdempresa", empresa.id_cdempresa)
          .update({cd_status: cdStatus})
      }

}
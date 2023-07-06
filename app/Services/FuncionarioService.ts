import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbDependenteFuncional from "App/Models/TbDependenteFuncional";
import TbEmpresa from "App/Models/TbEmpresa";
import TbFuncionario from "App/Models/TbFuncionario";
import TbProdutoComercial from "App/Models/TbProdutoComercial";
import { DateTime } from "luxon";

export default class FuncionarioService {
    async saveFuncionario(funcionarioParams: any, empresa: TbEmpresa, produtoComercial: TbProdutoComercial, transaction: TransactionClientContract): Promise<TbFuncionario> {
        const funcionario = new TbFuncionario

        funcionario.id_cdempresa_f = empresa.id_cdempresa;
        funcionario.nm_funcionario = funcionarioParams.nome;
        funcionario.nu_cpf = funcionarioParams.cpf;
        funcionario.nu_cns = funcionarioParams.cns;
        funcionario.nu_rg = funcionarioParams.rg;
        funcionario.ds_orgao_expedidor = funcionarioParams.idOrgaoExpedidor;
        funcionario.dt_nascimento = DateTime.fromFormat(funcionarioParams.dataNascimento || "", "dd/MM/yyyy").toString();
        funcionario.id_sexo_f = funcionarioParams.idSexo;
        funcionario.id_parentesco_f = funcionarioParams.idParentesco;
        funcionario.nm_mae = funcionarioParams.nomeMae;
        funcionario.nu_dddfixo = funcionarioParams.dddFixo;
        funcionario.nu_telefone = funcionarioParams.telefone;
        funcionario.nu_dddcelular = funcionarioParams.dddCelular;
        funcionario.nu_celular = funcionarioParams.celular;
        funcionario.ds_email = funcionarioParams.email;
        funcionario.id_prodcomerc_f = empresa.id_prodcomerc_e;
        funcionario.DT_CADASTRO = DateTime.now().toString()
        funcionario.tipo_plano = 1; // Sempre 1.
        funcionario.cd_codcontratoS4E = produtoComercial.produtoS4E.nu_CodigoAnsS4E;
        funcionario.nu_matriculafuncional = funcionarioParams.matriculaFuncional;
        funcionario.id_uf_f = funcionarioParams.idUf;
        funcionario.nu_CEP = funcionarioParams.cep;
        funcionario.tx_EndLograd = funcionarioParams.logradouro;
        funcionario.tx_EndNumero = funcionarioParams.numero;
        funcionario.tx_EndCompl = funcionarioParams.complemento;
        funcionario.tx_EndBairro = funcionarioParams.bairro;
        funcionario.tx_EndCidade = funcionarioParams.cidade;

        return await funcionario.useTransaction(transaction).save()
    }

    async deleteFuncionarioEDependentesByIdEmpresa(idEmpresa: number, transaction: TransactionClientContract) {
        await TbDependenteFuncional
            .query()
            .join("tb_funcionario", "id_funcionario_df", "id_funcionario")
            .where("tb_funcionario.id_cdempresa_f", idEmpresa)
            .useTransaction(transaction)
            .delete()

        await TbFuncionario
            .query()
            .where("id_cdempresa_f", idEmpresa)
            .useTransaction(transaction).delete()
    }

}
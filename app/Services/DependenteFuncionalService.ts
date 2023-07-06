import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbDependenteFuncional from "App/Models/TbDependenteFuncional";
import TbEmpresa from "App/Models/TbEmpresa";
import TbFuncionario from "App/Models/TbFuncionario";
import { DateTime } from "luxon";

export default class DependenteFuncionalService {
    async saveDependenteFuncional(empresa: TbEmpresa, funcionario: TbFuncionario, dependenteFuncional: any, transaction: TransactionClientContract) {
        const dependente = new TbDependenteFuncional();

        dependente.id_funcionario_df = funcionario.id_funcionario;
        dependente.nm_dependente = dependenteFuncional.nome;
        dependente.nu_cpf = dependenteFuncional.cpf;
        dependente.nu_rg = dependenteFuncional.rg;
        dependente.ds_orgao_expedidor = dependenteFuncional.idOrgaoExpedidor;
        dependente.nu_cns = dependenteFuncional.cns;
        dependente.dt_nasc = DateTime.fromFormat(dependenteFuncional.dataNascimento, "dd/MM/yyyy").toString();
        dependente.nm_mae = dependenteFuncional.nomeMae;
        dependente.id_sexo_df = dependenteFuncional.idSexo;
        dependente.id_parentesco_df = dependenteFuncional.idParentesco;
        dependente.id_prodcomerc_df = empresa.id_prodcomerc_e;
        dependente.vl_valor = empresa.nu_vl_mensalidade;
        dependente.ds_email = dependenteFuncional.email;
        dependente.documento_vinculo = dependenteFuncional.documentoVinculo;

        dependente.useTransaction(transaction).save()
    }
}
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbDependente from "App/Models/TbDependente";
import TbOrgaoExpedidor from "App/Models/TbOrgaoExpedidor";
import TbUf from "App/Models/TbUf";
export default class DependenteService {

  async saveDependente(novoDependente: any, associado: TbAssociado, transaction: TransactionClientContract) {
    const orgaoExpedidor = await TbOrgaoExpedidor.findOrFail(novoDependente.idOrgaoExpedidor)
    const uf = await TbUf.findOrFail(novoDependente.idUf)

    const dependente = new TbDependente();
    dependente.nm_dependente = novoDependente.nome;
    dependente.nu_cpf = novoDependente.cpf;
    dependente.nu_rg = novoDependente.rg;
    dependente.setOrgaoExpedidor(
        orgaoExpedidor.sigla || "",
        uf.sigla || "",
    );
    dependente.nu_cns = novoDependente.cns;
    dependente.dt_nasc = novoDependente.dataNascimento;
    dependente.nm_mae = novoDependente.nomeMae;
    dependente.cd_associado_d = associado.id_associado;
    dependente.id_sexo_d = novoDependente.idSexo || 0;
    dependente.id_parentesco_d = novoDependente.idParentesco || 14;
    dependente.cd_status = 0;
    await dependente.useTransaction(transaction).save();
  }

}
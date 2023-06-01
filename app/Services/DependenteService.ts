import TbAssociado from "App/Models/TbAssociado";
import TbDependente from "App/Models/TbDependente";
export default class DependenteService {

  async saveDependente(resp: any, associado: TbAssociado) {
    const dependente = new TbDependente();
    dependente.nm_dependente = resp.nome_dependente;
    dependente.nu_cpf = resp.cpf_dependente;
    dependente.nu_rg = resp.rg_dependente;
    dependente.setOrgaoExpedidor(
        resp.rg_dependente,
        resp.orgao_expedidor_uf_dependente
    );
    dependente.nu_cns = resp.cns_dependente;
    dependente.dt_nasc = resp.dt_nasc_dependente;
    dependente.nm_mae = resp.mae_dependente;
    dependente.cd_associado_d = associado.id_associado;
    dependente.id_sexo_d = resp.sexo_dependente;
    dependente.id_parentesco_d = resp.parentesco_dependente;
    dependente.cd_status = 0;
    await dependente.save();
  }

}
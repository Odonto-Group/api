import TbResponsavelFinanceiro from "App/Models/TbResponsvelFinanceiro";
import TbAssociado from "App/Models/TbAssociado";
import TbUf from "App/Models/TbUf";

export default class ResponsavelFinanceiroService {

  async buscarResponsavelFinanceiroPorIdAssociado(id_associado_rf: number): Promise<TbResponsavelFinanceiro> {
    return await TbResponsavelFinanceiro
        .query()
        .where('id_associado_rf', id_associado_rf)
        .first() || new TbResponsavelFinanceiro
  }

  async deleteResponsavelFinanceiroByIdAssociado(id_associado_rf: number) {
    await TbResponsavelFinanceiro
        .query()
        .where('id_associado_rf', id_associado_rf)
        .delete();
  }

  async saveResponsavelFinanceiroByAssociado(params: any, associado: TbAssociado, uf: TbUf) {
    const responsavelFinanceiro =  new TbResponsavelFinanceiro;
    responsavelFinanceiro.id_associado_rf = associado.id_associado;
    responsavelFinanceiro.nu_CPFRespFin = params.cpf;
    responsavelFinanceiro.nm_RespFinanc = params.nome_titular;
    responsavelFinanceiro.dt_NascRespFin =params.data_nascimento;
    responsavelFinanceiro.ds_emailRespFin = params.email_titular;
    responsavelFinanceiro.nu_CEP = params.cep;
    responsavelFinanceiro.tx_EndLograd = params.endereco;
    responsavelFinanceiro.tx_EndNumero = params.numero_casa;
    responsavelFinanceiro.tx_EndCompl = params.complemento || "";
    responsavelFinanceiro.tx_EndBairro = params.bairro;
    responsavelFinanceiro.tx_EndCidade = params.cidade;
    responsavelFinanceiro.id_uf_rf = uf.id_uf;
    responsavelFinanceiro.setCelularAttribute = params.celular;
    responsavelFinanceiro.save();
  }

  async saveResponsavelFinanceiro(params: any, associado: TbAssociado) {
    const responsavelFinanceiro =  new TbResponsavelFinanceiro;
    responsavelFinanceiro.id_associado_rf = associado.id_associado;
    responsavelFinanceiro.nu_CPFRespFin = params.cpf_responsavel_financeiro;
    responsavelFinanceiro.nm_RespFinanc = params.nome_responsavel_financeiro;
    responsavelFinanceiro.dt_NascRespFin = params.data_nascimento_responsavel_financeiro;
    responsavelFinanceiro.ds_emailRespFin = params.email_responsavel_financeiro;
    responsavelFinanceiro.nu_CEP = params.cep_responsavel_financeiro;
    responsavelFinanceiro.tx_EndLograd = params.endereco_responsavel_financeiro;
    responsavelFinanceiro.tx_EndNumero = params.numero_responsavel_financeiro;
    responsavelFinanceiro.tx_EndCompl = params.complemento_responsavel_financeiro || "";
    responsavelFinanceiro.tx_EndBairro = params.bairro_responsavel_financeiro;
    responsavelFinanceiro.tx_EndCidade = params.cidade_responsavel_financeiro;
    responsavelFinanceiro.id_uf_rf = params.uf_responsavel_financeiro;
    responsavelFinanceiro.setCelularAttribute(params.telefone_responsavel_financeiro);
    responsavelFinanceiro.save();
  }
}
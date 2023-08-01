import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import TbAssociado from "App/Models/TbAssociado";
import TbUf from "App/Models/TbUf";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { DateTime } from "luxon";

export default class ResponsavelFinanceiroService {

  async buscarResponsavelFinanceiroPorIdAssociado(id_associado_rf: number): Promise<TbResponsavelFinanceiro> {
    return await TbResponsavelFinanceiro
        .query()
        .where('id_associado_rf', id_associado_rf)
        .first() || new TbResponsavelFinanceiro
  }

  async deleteResponsavelFinanceiroByIdAssociado(id_associado_rf: number, transaction: TransactionClientContract) {
    await TbResponsavelFinanceiro
        .query()
        .where('id_associado_rf', id_associado_rf)
        .useTransaction(transaction)
        .delete();
  }

  async saveResponsavelFinanceiro(params: any, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbResponsavelFinanceiro> {
    const responsavelFinanceiro =  new TbResponsavelFinanceiro;
    responsavelFinanceiro.id_associado_rf = associado.id_associado;
    responsavelFinanceiro.nu_CPFRespFin = params.responsavelFinanceiro.cpf;
    responsavelFinanceiro.nm_RespFinanc = params.responsavelFinanceiro.nome ? params.responsavelFinanceiro.nome.toUpperCase() : "";
    responsavelFinanceiro.dt_NascRespFin = DateTime.fromFormat(params.responsavelFinanceiro.dataNascimento, "dd/MM/yyyy").toString();
    responsavelFinanceiro.ds_emailRespFin = params.responsavelFinanceiro.email ? params.responsavelFinanceiro.email.toUpperCase() : "";
    responsavelFinanceiro.nu_CEP = params.responsavelFinanceiro.cep ? params.responsavelFinanceiro.cep.replace(/\D/g, "") : "00000000";
    responsavelFinanceiro.tx_EndLograd = params.responsavelFinanceiro.endereco;
    responsavelFinanceiro.tx_EndNumero = params.responsavelFinanceiro.numero;
    responsavelFinanceiro.tx_EndCompl = params.responsavelFinanceiro.complemento || "";
    responsavelFinanceiro.tx_EndBairro = params.responsavelFinanceiro.bairro;
    responsavelFinanceiro.tx_EndCidade = params.responsavelFinanceiro.cidade;
    responsavelFinanceiro.id_uf_rf = params.responsavelFinanceiro.idUf;
    responsavelFinanceiro.setCelularAttribute(params.responsavelFinanceiro.telefone);
    return await responsavelFinanceiro.useTransaction(transaction).save();
  }
}
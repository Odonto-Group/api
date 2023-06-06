import TbResponsavelFinanceiro from "App/Models/TbResponsavelFinanceiro";
import TbAssociado from "App/Models/TbAssociado";
import TbUf from "App/Models/TbUf";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";

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

  async saveResponsavelFinanceiroByAssociado(params: any, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbResponsavelFinanceiro> {
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
    responsavelFinanceiro.id_uf_rf = params.idUf;
    responsavelFinanceiro.setCelularAttribute(params.telefone_responsavel_financeiro);
    return await responsavelFinanceiro.useTransaction(transaction).save();
  }

  async saveResponsavelFinanceiro(params: any, associado: TbAssociado, transaction: TransactionClientContract): Promise<TbResponsavelFinanceiro> {
    const responsavelFinanceiro =  new TbResponsavelFinanceiro;
    responsavelFinanceiro.id_associado_rf = associado.id_associado;
    responsavelFinanceiro.nu_CPFRespFin = params.responsavelFinanceiro.cpf;
    responsavelFinanceiro.nm_RespFinanc = params.responsavelFinanceiro.nome;
    responsavelFinanceiro.dt_NascRespFin = params.responsavelFinanceiro.dataNascimento;
    responsavelFinanceiro.ds_emailRespFin = params.responsavelFinanceiro.email;
    responsavelFinanceiro.nu_CEP = params.responsavelFinanceiro.cep;
    responsavelFinanceiro.tx_EndLograd = params.responsavelFinanceiro.enderenco;
    responsavelFinanceiro.tx_EndNumero = params.responsavelFinanceiro.numero;
    responsavelFinanceiro.tx_EndCompl = params.responsavelFinanceiro.complemento || "";
    responsavelFinanceiro.tx_EndBairro = params.responsavelFinanceiro.bairro;
    responsavelFinanceiro.tx_EndCidade = params.responsavelFinanceiro.cidade;
    responsavelFinanceiro.id_uf_rf = params.responsavelFinanceiro.idUf;
    responsavelFinanceiro.setCelularAttribute(params.responsavelFinanceiro.telefone);
    return await responsavelFinanceiro.useTransaction(transaction).save();
  }
}
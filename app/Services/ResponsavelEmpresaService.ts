import TbResponsavelEmpresa from "App/Models/TbResponsavelEmpresa";
import TbEmpresa from "App/Models/TbEmpresa";
import TbUf from "App/Models/TbUf";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { DateTime } from "luxon";

export default class ResponsavelEmpresaService {

  async deleteResponsavelEmpresaByIdEmpresa(idEmpresa: number, transaction: TransactionClientContract) {
    await TbResponsavelEmpresa
        .query()
        .where('id_empresa_rf', idEmpresa)
        .useTransaction(transaction)
        .delete();
  }

  async saveResponsavelEmpresa(params: any, empresa: TbEmpresa, transaction: TransactionClientContract): Promise<TbResponsavelEmpresa> {
    const responsavelEmpresa =  new TbResponsavelEmpresa;
    responsavelEmpresa.id_empresa_rf = empresa.id_cdempresa;
    responsavelEmpresa.nu_CPFRespFin = params.responsavelEmpresa.cpf;
    responsavelEmpresa.nm_RespFinanc = params.responsavelEmpresa.nome ? params.responsavelEmpresa.nome.toUpperCase() : "";
    responsavelEmpresa.dt_NascRespFin = DateTime.fromFormat(params.responsavelEmpresa.dataNascimento, "dd/MM/yyyy").toString();
    responsavelEmpresa.ds_emailRespFin = params.responsavelEmpresa.email ? params.responsavelEmpresa.email.toUpperCase() : "";
    responsavelEmpresa.setCelularAttribute(params.responsavelEmpresa.telefone);
    responsavelEmpresa.nr_proposta = empresa.nr_proposta
    return await responsavelEmpresa.useTransaction(transaction).save();
  }
}
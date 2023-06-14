import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoBoleto from "App/Models/TbPagamentoBoleto";

export default class PagamentoBoletoService {

    async savePagamentoEfetuado(associado: TbAssociado, params: Record<string, any>, transaction: TransactionClientContract) {
        const tbPagamentoBoleto = new TbPagamentoBoleto

        tbPagamentoBoleto.cd_associado_pb = associado.id_associado
        tbPagamentoBoleto.id_banco_pb = associado.

        await tbPagamentoBoleto.useTransaction(transaction).save();
    }
  
}
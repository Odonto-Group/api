import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoPix from "App/Models/TbPagamentoPix";
import TbPagamentoPixOdontocob from "App/Models/TbPagamentoPixOdontoCob";

export default class PagamentoPixService {

    async savePagamentoEfetuado(associado: TbAssociado, params: any, pixOdontoCob: TbPagamentoPixOdontocob, transaction: TransactionClientContract) {
        const tbPagamentoPix = new TbPagamentoPix

        tbPagamentoPix.cdAssociado = associado.id_associado
        tbPagamentoPix.idPixOdontocob = pixOdontoCob.idPixOdontocob
        //tbPagamentoPix.copiaCola = ??
        tbPagamentoPix.dtCadastro = pixOdontoCob.dtCadastro
        tbPagamentoPix.dtPagamento = pixOdontoCob.dtPagamento
        //tbPagamentoPix.dtVencimento = ??

        await tbPagamentoPix.useTransaction(transaction).save();
    }
  
}
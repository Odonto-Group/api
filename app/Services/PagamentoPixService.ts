import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoPix from "App/Models/TbPagamentoPix";
import TbPagamentoPixOdontocob from "App/Models/TbPagamentoPixOdontoCob";

export default class PagamentoPixService {

    async savePagamentoEfetuado(associado: TbAssociado, pixOdontoCob: TbPagamentoPixOdontocob, transaction: TransactionClientContract) {
        const tbPagamentoPix = new TbPagamentoPix

        tbPagamentoPix.cd_associado = associado.id_associado
        tbPagamentoPix.id_pix_odontocob = pixOdontoCob.id_pix_odontocob
        tbPagamentoPix.dt_cadastro = pixOdontoCob.dt_cadastro
        tbPagamentoPix.dt_pagamento = pixOdontoCob.dt_pagamento
        tbPagamentoPix.dt_vencimento = pixOdontoCob.dt_vencimento
        tbPagamentoPix.valor = pixOdontoCob.valor_pago

        await tbPagamentoPix.useTransaction(transaction).save();
    }
  
}
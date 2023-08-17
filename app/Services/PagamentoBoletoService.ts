import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoBoleto from "App/Models/TbPagamentoBoleto";
import TbPagamentoBoletoOdontoCob from "App/Models/TbPagamentoBoletoOdontoCob";
import { DateTime } from "luxon";

export default class PagamentoBoletoService {

    async savePagamentoEfetuado(associado: TbAssociado, params: Record<string, any>, pagamentoOdontoCob: TbPagamentoBoletoOdontoCob, transaction: TransactionClientContract) {
        const tbPagamentoBoleto = new TbPagamentoBoleto

        tbPagamentoBoleto.cd_associado_pb = associado.id_associado
        tbPagamentoBoleto.id_banco_pb = 69 // ITAU
        tbPagamentoBoleto.nu_nossonum = params.nossoNumero
        tbPagamentoBoleto.nu_IdBolSimples = params.boletoId
        tbPagamentoBoleto.nu_valoremissao = pagamentoOdontoCob.nu_valoremissao
        tbPagamentoBoleto.dt_vencimento = pagamentoOdontoCob.dt_pagamento
        tbPagamentoBoleto.dt_emissao = pagamentoOdontoCob.dt_emissao
        tbPagamentoBoleto.dt_pagamento = DateTime.now().toString()
        tbPagamentoBoleto.nu_statusboleto = 0
        tbPagamentoBoleto.nu_unico = pagamentoOdontoCob.nu_unico
        tbPagamentoBoleto.vl_valorpago = pagamentoOdontoCob.vl_valorpago

        await tbPagamentoBoleto.useTransaction(transaction).save();
    }
  
}
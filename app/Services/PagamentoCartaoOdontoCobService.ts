import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoBoletoOdontoCob from "App/Models/TbPagamentoBoletoOdontoCob";
import TbPagamentoCartaoOdontoCob from "App/Models/TbPagamentoCartaoOdontoCob";
import { DateTime } from "luxon";

export default class PagamentoCartaoOdontoCobService {
    async findByAssociado(idAssociado: number): Promise<TbPagamentoCartaoOdontoCob> {
        return await TbPagamentoCartaoOdontoCob.query()
           .where('cd_associado_pco', idAssociado)
           .first() || new TbPagamentoCartaoOdontoCob
    }

    async savePagamento(associado: TbAssociado, geraOC: any, dataVencimento: string, linkPagamento: string, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoCartaoOdontoCob
          pagamento.cd_associado_pco = associado.id_associado,
          pagamento.tx_token = geraOC.data.dados.id,
          pagamento.vl_valor = geraOC.data.dados.valor,
          pagamento.dt_cadastro = DateTime.local().toFormat('yyyy/mm/dd'),
          pagamento.dt_vencimento = dataVencimento,
          pagamento.nr_proposta = geraOC.data.dados.compraId,
          pagamento.bl_ativo = true,
          pagamento.link_pgto = linkPagamento
          
          pagamento.useTransaction(transaction).save();
    }

    async savePagamentoEfetuadoOdontoCob(associado: TbAssociado, params: any, transaction: TransactionClientContract) {
        let pagamentoCartaoOdontoCob = await this.findByAssociado(associado.id_associado);

        pagamentoCartaoOdontoCob.cd_associado_pco = associado.id_associado
        pagamentoCartaoOdontoCob.vl_valor = pagamentoCartaoOdontoCob.vl_valor || associado.nu_vl_mensalidade
        pagamentoCartaoOdontoCob.nr_proposta = params.compraId
        pagamentoCartaoOdontoCob.tx_token = pagamentoCartaoOdontoCob.tx_token || "0"
        pagamentoCartaoOdontoCob.dt_vencimento = pagamentoCartaoOdontoCob.dt_vencimento || associado.dt_inicio_vigencia
        pagamentoCartaoOdontoCob.pagamento_id = params.pagamentoId
        pagamentoCartaoOdontoCob.dt_pagamento = DateTime.now().toFormat("yyyy-MM-dd")
        pagamentoCartaoOdontoCob.nsu = params.nsu
        pagamentoCartaoOdontoCob.autorizacao_codigo = params.autorizacaoCodigo || params.autorizacao
        pagamentoCartaoOdontoCob.cartao_id = params.nsu

        pagamentoCartaoOdontoCob.useTransaction(transaction).save();
    }

    async deletePagamento(associado: TbAssociado, transaction: TransactionClientContract) {
        await TbPagamentoCartaoOdontoCob
        .query()
        .where('cd_associado_pco', associado.id_associado)
        .useTransaction(transaction)
        .delete()
    }
}
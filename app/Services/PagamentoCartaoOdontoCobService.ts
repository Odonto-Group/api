import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoCartaoOdontoCob from "App/Models/TbPagamentoCartaoOdontoCob";
import { DateTime } from "luxon";

export default class PagamentoCartaoOdontoCobService {
    async findByAssociado(idAssociado: number): Promise<TbPagamentoCartaoOdontoCob> {
        return await TbPagamentoCartaoOdontoCob.query()
           .where('cd_associado_pco', idAssociado)
           .first() || new TbPagamentoCartaoOdontoCob
    }

    async savePagamento(associado: TbAssociado, pagamentoGerado: any, dataVencimento: string, linkPagamento: string, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoCartaoOdontoCob
        pagamento.cd_associado_pco = associado.id_associado
        pagamento.tx_token = pagamentoGerado.pagamentoId
        pagamento.vl_valor = pagamentoGerado.compraValor
        pagamento.dt_cadastro = DateTime.now().toString()
        pagamento.dt_vencimento = dataVencimento
        pagamento.nr_proposta = pagamentoGerado.compraId
        pagamento.dt_pagamento = pagamentoGerado.pagamentoData
        pagamento.pagamentoId = pagamentoGerado.pagamentoId
        pagamento.nsu = pagamentoGerado.transacao.nsu
        pagamento.autorizacaoCodigo = pagamentoGerado.transacao.autorizacaoCodigo
        pagamento.cartaoId = pagamentoGerado.cartaoId
        pagamento.blAtivo = 1
        pagamento.linkPgto = linkPagamento

        
        await pagamento.useTransaction(transaction).save();
    }
    async savePagamentoLink(associado: TbAssociado, pagamentoGerado: any, dataVencimento: string, linkPagamento: string) {
        const pagamento = new TbPagamentoCartaoOdontoCob
        pagamento.cd_associado_pco = associado.id_associado
        pagamento.tx_token = pagamentoGerado.id
        pagamento.vl_valor = associado.nu_vl_mensalidade
        pagamento.dt_cadastro = DateTime.now().toString()
        pagamento.dt_vencimento = dataVencimento
        pagamento.nr_proposta = pagamentoGerado.compraId
        pagamento.dt_pagamento = ''
        pagamento.pagamentoId =  ''
        pagamento.nsu = '0'
        pagamento.autorizacaoCodigo = '0'
        pagamento.cartaoId = pagamentoGerado.cartaoId
        pagamento.blAtivo = 1
        pagamento.linkPgto = linkPagamento

        
        await pagamento.save();
    }

    async savePagamentoEfetuadoOdontoCob(associado: TbAssociado, params: any, transaction: TransactionClientContract) {
        let pagamentoCartaoOdontoCob = await this.findByAssociado(associado.id_associado);

        pagamentoCartaoOdontoCob.cd_associado_pco = associado.id_associado
        pagamentoCartaoOdontoCob.vl_valor = pagamentoCartaoOdontoCob.vl_valor || associado.nu_vl_mensalidade
        pagamentoCartaoOdontoCob.nr_proposta = params.compraId
        pagamentoCartaoOdontoCob.tx_token = pagamentoCartaoOdontoCob.tx_token || "0"
        pagamentoCartaoOdontoCob.dt_vencimento = pagamentoCartaoOdontoCob.dt_vencimento || associado.dt_inicio_vigencia
        pagamentoCartaoOdontoCob.pagamentoId = params.pagamentoId
        pagamentoCartaoOdontoCob.dt_pagamento = DateTime.now().toString()
        pagamentoCartaoOdontoCob.nsu = params.transacao.nsu
        pagamentoCartaoOdontoCob.autorizacaoCodigo = params.transacao.autorizacaoCodigo || params.transacao.autorizacao
        pagamentoCartaoOdontoCob.cartaoId = params.transacao.nsu

        pagamentoCartaoOdontoCob.useTransaction(transaction).save();
    }

    async deletePagamento(associado: TbAssociado, transaction: TransactionClientContract) {
        await TbPagamentoCartaoOdontoCob
        .query()
        .where('cd_associado_pco', associado.id_associado)
        .useTransaction(transaction)
        .delete()
    }
    async deletePagamentoLink(associado: TbAssociado) {
        await TbPagamentoCartaoOdontoCob
        .query()
        .where('cd_associado_pco', associado.id_associado)
        .delete()
    }
}
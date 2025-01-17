import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoConsignado from "App/Models/TbPagamentoConsignado";
import { DateTime } from "luxon";

export default class PagamentoConsignadoService {
    async findByAssociado(idAssociado: number): Promise<TbPagamentoConsignado> {
        return await TbPagamentoConsignado.query()
           .where('cd_associado_pco', idAssociado)
           .first() || new TbPagamentoConsignado
    }

    async savePagamento(associado: TbAssociado, pagamentoGerado: any, dataVencimento: DateTime, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoConsignado
        pagamento.cd_associado_con = associado.id_associado
        //pagamento.cd_tokenGdf = pagamentoGerado.pagamentoId
        pagamento.nu_valor = pagamentoGerado.compraValor
        pagamento.dt_vencimento = String(dataVencimento)
        pagamento.id_orgao_con = pagamentoGerado.orgao
        pagamento.id_Fontepag_con = pagamentoGerado.fontePgd
        pagamento.id_perfil_con = pagamentoGerado.perfil
        pagamento.cd_vincservpub_con = pagamentoGerado.vinculo
        pagamento.tx_desc_cargo = pagamentoGerado.Desc_cargo
        pagamento.tx_matric_serv = pagamentoGerado.matricula
        //pagamento. = pagamentoGerado.compraId
        //pagamento.dt_pagamento = pagamentoGerado.pagamentoData

        
        await pagamento.useTransaction(transaction).save();
    }

    async deletePagamento(associado: TbAssociado, transaction: TransactionClientContract) {
        await TbPagamentoConsignado
        .query()
        .where('cd_associado_pco', associado.id_associado)
        .useTransaction(transaction)
        .delete()
    }
}
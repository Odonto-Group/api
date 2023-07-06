import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoPixOdontoCob from "App/Models/TbPagamentoPixOdontoCob";
import { DateTime } from "luxon";

export default class PagamentoPixOdontoCobService {

    async removePagamentoEmpresaPix(idEmpresa: number, transaction: TransactionClientContract) {
        return await TbPagamentoPixOdontoCob.query()
           .where('cd_empresa', idEmpresa)
           .useTransaction(transaction)
           .delete()
    }

    async removePagamentoIndividualPix(idAssociado: number, transaction: TransactionClientContract) {
        return await TbPagamentoPixOdontoCob.query()
           .where('cd_associado', idAssociado)
           .useTransaction(transaction)
           .delete()
    }

    async findByAssociado(idAssociado: number): Promise<TbPagamentoPixOdontoCob> {
        return await TbPagamentoPixOdontoCob.query()
           .where('cd_associado', idAssociado)
           .first() || new TbPagamentoPixOdontoCob
    }

    async savePagamentoIndividual(id_associado: number, pixId: string, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoPixOdontoCob

        pagamento.cd_associado = id_associado
        pagamento.dt_cadastro = DateTime.local().toFormat('yyyy/mm/dd')
        pagamento.id_pix_odontocob = pixId
        
        await pagamento.useTransaction(transaction).save();
    }

    async savePagamentoEmpresa(idEmpresa: number, pixId: string, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoPixOdontoCob

        pagamento.cd_empresa = idEmpresa
        pagamento.dt_cadastro = DateTime.local().toFormat('yyyy/mm/dd')
        pagamento.id_pix_odontocob = pixId
        pagamento.created_at = DateTime.now().toString()
        
        await pagamento.useTransaction(transaction).save();
    }

    async savePagamentoEfetuadoOdontoCob(associado: TbAssociado, params: any, transaction: TransactionClientContract): Promise<TbPagamentoPixOdontoCob> {
        const pagamentoPixOdontoCob = await this.findByAssociado(associado.id_associado);

        pagamentoPixOdontoCob.dt_pagamento = params.dataPagamento
        pagamentoPixOdontoCob.valor_pago = params.valor

        pagamentoPixOdontoCob.useTransaction(transaction).save()

        return pagamentoPixOdontoCob;
    }
}
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

    async savePagamentoIndividual(id_associado: number, valor: number, pagamento: any, dataPrimeiroVencimento: DateTime, transaction: TransactionClientContract) {
        const pagamentoOdontoCob = new TbPagamentoPixOdontoCob

        pagamentoOdontoCob.cd_associado = id_associado
        pagamentoOdontoCob.dt_cadastro = DateTime.local().toFormat('yyyy/mm/dd')
        pagamentoOdontoCob.id_pix_odontocob = pagamento.pix ? pagamento.pix.id : null
        pagamentoOdontoCob.qr_code = pagamento.pix ? pagamento.pix.base64 :null
        pagamentoOdontoCob.copia_cola = pagamento.pix ? pagamento.pix.copiaCola : null
        pagamentoOdontoCob.created_at = DateTime.now().toString()
        pagamentoOdontoCob.updated_at = DateTime.now().toString()
        pagamentoOdontoCob.valor = valor
        pagamentoOdontoCob.dt_vencimento = dataPrimeiroVencimento.toString()

        await pagamentoOdontoCob.useTransaction(transaction).save();
    }

    async savePagamentoEmpresa(idEmpresa: number, valor: number, pagamento: any, dataPrimeiroVencimento: DateTime, transaction: TransactionClientContract) {
        const pagamentoOdontoCob = new TbPagamentoPixOdontoCob

        pagamentoOdontoCob.cd_empresa = idEmpresa
        pagamentoOdontoCob.dt_cadastro = DateTime.local().toFormat('yyyy/mm/dd')
        pagamentoOdontoCob.created_at = DateTime.now().toString()
        pagamentoOdontoCob.updated_at = DateTime.now().toString()
        pagamentoOdontoCob.id_pix_odontocob = pagamento.pix ? pagamento.pix.id : null
        pagamentoOdontoCob.qr_code = pagamento.pix ? pagamento.pix.base64 :null
        pagamentoOdontoCob.copia_cola = pagamento.pix ? pagamento.pix.copiaCola : null
        pagamentoOdontoCob.valor = valor
        pagamentoOdontoCob.dt_vencimento = dataPrimeiroVencimento.toString()
        
        await pagamentoOdontoCob.useTransaction(transaction).save();
    }

    async savePagamentoEfetuadoOdontoCob(associado: TbAssociado, params: any, transaction: TransactionClientContract): Promise<TbPagamentoPixOdontoCob> {
        const pagamentoPixOdontoCob = await this.findByAssociado(associado.id_associado);

        pagamentoPixOdontoCob.dt_pagamento = DateTime.fromFormat(params.dataPagamento, 'dd/MM/yyyy').toString()
        pagamentoPixOdontoCob.dt_cadastro = DateTime.now().toString()
        pagamentoPixOdontoCob.valor_pago = params.valor
        pagamentoPixOdontoCob.updated_at = DateTime.now().toString()

        await pagamentoPixOdontoCob.useTransaction(transaction).save()

        return pagamentoPixOdontoCob;
    }
}
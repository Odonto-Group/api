import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoPixOdontoCob from "App/Models/TbPagamentoPixOdontoCob";
import { DateTime } from "luxon";

export default class PagamentoPixOdontoCobService {

    async findByAssociado(idAssociado: number): Promise<TbPagamentoPixOdontoCob> {
        return await TbPagamentoPixOdontoCob.query()
           .where('cdAssociado', idAssociado)
           .first() || new TbPagamentoPixOdontoCob
    }

    async savePagamento(id_associado: number, pixId: string, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoPixOdontoCob

        pagamento.cdAssociado = id_associado
        pagamento.dtCadastro = DateTime.local().toFormat('yyyy/mm/dd')
        pagamento.idPixOdontocob = pixId
        
        pagamento.useTransaction(transaction).save();
    }

    async savePagamentoEfetuadoOdontoCob(associado: TbAssociado, params: any, transaction: TransactionClientContract): Promise<TbPagamentoPixOdontoCob> {
        const pagamentoPixOdontoCob = await this.findByAssociado(associado.id_associado);

        pagamentoPixOdontoCob.dtPagamento = params.dataPagamento
        pagamentoPixOdontoCob.valorPago = params.valor

        pagamentoPixOdontoCob.useTransaction(transaction).save()

        return pagamentoPixOdontoCob;
    }
}
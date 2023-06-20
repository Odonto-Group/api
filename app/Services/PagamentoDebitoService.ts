import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoDebito from "App/Models/TbPagamentoDebito";
import { DateTime } from "luxon";

export default class PagamentoDebitoService {

    async savePagamentoDebito(params: any, associado: TbAssociado, dataExpiracao: string, transaction: TransactionClientContract) {
        const pagamentoDebito = new TbPagamentoDebito
        pagamentoDebito.cd_associado_pd = associado.id_associado;
        pagamentoDebito.id_banco_pd = params.idBanco;
        pagamentoDebito.nu_agencia = params.agencia;
        pagamentoDebito.nu_conta = params.conta;
        pagamentoDebito.nu_valor = associado.nu_vl_mensalidade;
        pagamentoDebito.ds_vencimento = dataExpiracao;
        pagamentoDebito.nu_OperacaoCEF = params.operacao || 0;
        await pagamentoDebito.useTransaction(transaction).save();
    }
 
    async removePagamentoDebitoByIdAssociado(associado: TbAssociado, transaction: TransactionClientContract) {
        await TbPagamentoDebito.query()
            .where('cd_associado_pd', associado.id_associado)
            .useTransaction(transaction)
            .delete()
    }
  
}
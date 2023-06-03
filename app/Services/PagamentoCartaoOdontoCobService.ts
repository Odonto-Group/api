import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoCartaoOdontoCob from "App/Models/TbPagamentoCartaoOdontoCob";
import { DateTime } from "luxon";


export default class PagamentoCartaoOdontoCobService {
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

    async deletePagamento(associado: TbAssociado, transaction: TransactionClientContract) {
        await TbPagamentoCartaoOdontoCob
        .query()
        .where('cd_associado_pco', associado.id_associado)
        .useTransaction(transaction)
        .delete()
    }
}
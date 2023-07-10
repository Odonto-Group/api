import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";

export default interface FluxoConfirmacaoPagamentoStrategy {
    confirmarPagamento(params: any, transaction: TransactionClientContract): Promise<string>;
}

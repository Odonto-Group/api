import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";

export default interface FluxoConfirmacaoPagamentoStrategy {
    confirmarPagamento(params: any, associado:TbAssociado,paymentStatus:number, transaction: TransactionClientContract): Promise<string>;
}

import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbPagamentoBoleto from "App/Models/TbPagamentoBoleto";

export default class PagamentoBoletoService {

    async inserePagamentoEfetuado(params: Record<string, any>, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoBoleto;

        

        await pagamento.useTransaction(transaction).save();
    }
  
}
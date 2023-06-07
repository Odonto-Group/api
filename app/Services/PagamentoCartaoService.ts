import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoCartao from "App/Models/TbPagamentoCartao";

export default class PagamentoCartaoService {
    async savePagamentoEfetuado(associado: TbAssociado, params: any, transaction: TransactionClientContract) {
        const tbPagamentoCartao = new TbPagamentoCartao

        tbPagamentoCartao.cd_associado_pc = associado.id_associado;
        tbPagamentoCartao.tid = params.nsu;
        tbPagamentoCartao.mensagem = 'Transacao capturada com sucesso';
        tbPagamentoCartao.parcela = 1;
        tbPagamentoCartao.nu_numcartao = params.cartaoId;
        tbPagamentoCartao.cod_autorizacao = params.autorizacaoCodigo || params.autorizacao;
        tbPagamentoCartao.vl_valor = associado.nu_vl_mensalidade;
        tbPagamentoCartao.codigoRetorno = '0';
        tbPagamentoCartao.nu_cvv = params.pagamentoId;

        await tbPagamentoCartao.useTransaction(transaction).save();
    }

    async inserePagamentoEfetuado(params: Record<string, any>, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoCartao;

        

        await pagamento.useTransaction(transaction).save();
    }
  
}
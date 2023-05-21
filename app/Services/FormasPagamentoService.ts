import TbFormasPagamento from 'App/Models/TbFormasPagamento';
import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class FormasPagamentoService {

  async findFormaPagamento(idProdutoComercial: number, idBanco: number, formaPagamento: any): Promise<TbFormasPagamento> {

    if (formaPagamento.gpPagto == 2) {
    // SELECT * FROM tb_formaspgtoIF tfi 
    // INNER JOIN tb_ProdutoComercial tpc 
    // 	ON tfi.id_prodcomerc_if = tpc.id_prodcomerc 
    // INNER JOIN tb_formabco tf 
    // 	ON tfi.id_formaspgtoIF  = tf.id_formaspgtoIF_fb 
    // INNER JOIN tb_banco tb tb
    // 	ON tb.id_banco = tf.id_banco_fb 
    // WHERE 
    // 	tpc.id_prodcomerc = 'idProdComercial'
    } else {
    // SELECT * FROM tb_formaspgtoIF tfi 
    // INNER JOIN tb_ProdutoComercial tpc 
    // 	ON tfi.id_prodcomerc_if = tpc.id_prodcomerc 
    // INNER JOIN tb_formabco tf 
    // 	ON tfi.id_formaspgtoIF  = tf.id_formaspgtoIF_fb 
    // INNER JOIN tb_banco tb
    // 	ON tb.id_banco = tf.id_banco_fb 
    // WHERE 
    // 	tpc.id_prodcomerc = 'idProdComercial'
    // 	AND id_meiopagto_if = :idPagamento
    }
    


    return new TbFormasPagamento;
  }
  
}
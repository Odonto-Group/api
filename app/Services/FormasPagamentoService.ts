import TbFormasPagamento from 'App/Models/TbFormasPagamento';
import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class FormasPagamentoService {

  async findFormaPagamento(idProdutoComercial: number, idBanco: number, formaPagamento: any): Promise<TbFormasPagamento | null> {
    if (formaPagamento.gpPagto == 2) {
      return await TbFormasPagamento
      .query()
      .preload('produtoComercial')
      .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoIF.id_prodcomerc_if')
      .innerJoin('tb_formabco', 'tb_formabco.id_formaspgtoIF_fb', 'tb_formaspgtoIF.id_formaspgtoIF')
      .innerJoin('tb_banco', 'tb_banco.id_banco', 'tb_formabco.id_banco_fb')
      .where('tb_formaspgtoIF.id_prodcomerc_if', idProdutoComercial)
      .where('tb_banco.id_banco', idBanco)
      .first();
    } else {
      return await TbFormasPagamento
      .query()
      .preload('produtoComercial')
      .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoIF.id_prodcomerc_if')
      .innerJoin('tb_formabco', 'tb_formabco.id_formaspgtoIF_fb', 'tb_formaspgtoIF.id_formaspgtoIF')
      .innerJoin('tb_banco', 'tb_banco.id_banco', 'tb_formabco.id_banco_fb')
      .where('tb_formaspgtoIF.id_prodcomerc_if', idProdutoComercial)
      .where('tb_formaspgtoIF.id_meiopagto_if', formaPagamento.idPagto)
      .first();
    }
  }
  
}
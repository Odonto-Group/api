import TbFormasPagamentoEmpresa from 'App/Models/TbFormasPagamentoEmpresa';
import TbFormasPagamentoIndividual from 'App/Models/TbFormasPagamentoIndividual';

export default class FormasPagamentoService {

  async findFormaPagamentoIndividual(idProdutoComercial: number, idBanco: number, formaPagamento: any): Promise<TbFormasPagamentoIndividual | null> {
    if (formaPagamento.gpPagto == 2) {
      return await TbFormasPagamentoIndividual
      .query()
      .preload('produtoComercial')
      .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoIF.id_prodcomerc_if')
      .innerJoin('tb_formabco', 'tb_formabco.id_formaspgtoIF_fb', 'tb_formaspgtoIF.id_formaspgtoIF')
      .innerJoin('tb_banco', 'tb_banco.id_banco', 'tb_formabco.id_banco_fb')
      .where('tb_formaspgtoIF.id_prodcomerc_if', idProdutoComercial)
      .where('tb_banco.id_banco', idBanco)
      .first();
    } else {
      return await TbFormasPagamentoIndividual
      .query()
      .preload('produtoComercial')
      .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoIF.id_prodcomerc_if')
      .where('tb_formaspgtoIF.id_prodcomerc_if', idProdutoComercial)
      .where('tb_formaspgtoIF.id_meiopagto_if', formaPagamento.idPagto)
      .first();
    }
  }

  async findFormaPagamentoEmpresa(idProdutoComercial: number): Promise<TbFormasPagamentoEmpresa | null> {
      return await TbFormasPagamentoEmpresa
      .query()
      .preload('produtoComercial')
      .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_formaspgtoCol.id_prodcomerc_fc')
      .where('tb_formaspgtoCol.id_prodcomerc_fc', idProdutoComercial)
      .where('tb_formaspgtoCol.id_meiopagto_fc', 14) // Id meio pagamento NF/FATURA
      .first();
  }
  
}
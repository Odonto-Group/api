import TbProdutoComercial from "App/Models/TbProdutoComercial";
export default class ProdutoComercialService {

  async getById(produtoId: string): Promise<TbProdutoComercial | null> {
    const produtoComercial = await TbProdutoComercial.query().where('id_prodcomerc', produtoId).first();

    return produtoComercial;
  }
  async getByS4eId(produtoId: string): Promise<TbProdutoComercial | null> {
    const produtoComercial = await TbProdutoComercial.query()
        .where('id_ProdutoS4E_c', produtoId)
        .orderBy('id_prodcomerc', 'desc')
        .first();

    return produtoComercial;
}
}
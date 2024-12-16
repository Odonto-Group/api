import TbProdutoComercial from "App/Models/TbProdutoComercial";
export default class ProdutoComercialService {

  async getById(produtoId: string): Promise<TbProdutoComercial | null> {
    const produtoComercial = await TbProdutoComercial.query().where('id_prodcomerc', produtoId).first();

    return produtoComercial;
  }
}
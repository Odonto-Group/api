import TbParceiro from 'App/Models/TbParceiro';


export default class PlanService {

  async getPlan(sigla: string, idModProduto: number, idCategoria: number): Promise<TbParceiro[]> {
    return await TbParceiro
    .query()
    .select('tmp.tx_nome', 'tfi.vl_valor', 'tmp.id_modProduto')
    .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
    .innerJoin('tb_ModProduto as tmp', 'tmp.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
    .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
    .leftJoin('tb_TipoPreco as ttp', 'ttp.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
    .leftJoin('tb_formaspgtoIF as tfi', 'tfi.id_prodcomerc_if', 'tb_ProdutoComercial.id_prodcomerc')
    .where('tb_ProdutoComercial.nu_PublicaInt', 1)
    .where('tb_ProdutoComercial.en_status', 1)
    .where('tb_ModProduto.id_modProduto', idModProduto)
    .where('tb_ProdutoComercial.en_SitCarencia', 0)
    .where('tb_AbrangRegiao.id_uf_r', sigla)
    .where('tb_categoria.id_categoria', idCategoria)
    .where('nu_cdVendedor4E_tk', '=', 0)
    .where('nu_cdCorretoraS4E_tk', '=', 0)
    .orderBy('tfi.vl_valor', 'asc')
    .distinct();
  }
  
}
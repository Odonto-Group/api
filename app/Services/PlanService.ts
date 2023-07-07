import PlanoNaoEncontrado from 'App/Exceptions/PlanoNaoEncontrado';
import TbParceiro from 'App/Models/TbParceiro';


export default class PlanService {

  async getPlanWithTokenIndividual(sigla: string, idCategoria: number[], token: string): Promise<TbParceiro> {
    const parceiro = await TbParceiro
    .query()
    .preload('produtoComercial', (query) => {
      query.preload('formasPagamentoIndividual')
    })
    .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
    .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
    .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
    .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
    .leftJoin('tb_formaspgtoIF', 'tb_formaspgtoIF.id_prodcomerc_if', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
    .where('tb_ProdutoComercial.nu_PublicaInt', 1)
    .where('tb_ProdutoComercial.en_status', 1)
    .where('tb_UF.sigla', sigla)
    .whereIn('tb_categoria.id_categoria', idCategoria)
    .where('tb_tokenidparc.cd_Codtokenidparc', token)
    .orderBy('tb_formaspgtoIF.vl_valor', 'asc')
    .distinct()
    .first();

    if (!parceiro?.produtoComercial.formasPagamentoIndividual[0]?.vl_valor) {
      throw new PlanoNaoEncontrado();
    }

    return parceiro;
  }

  async getBasicPlanIndividual(sigla: string, idCategoria: number[]): Promise<TbParceiro> {
    return await TbParceiro
    .query()
    .preload('produtoComercial', (query) => {
      query.preload('formasPagamentoIndividual')
    })
    .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
    .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
    .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
    .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
    .leftJoin('tb_formaspgtoIF', 'tb_formaspgtoIF.id_prodcomerc_if', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
    .where('tb_ProdutoComercial.nu_PublicaInt', 1)
    .where('tb_ProdutoComercial.en_status', 1)
    .where('tb_UF.sigla', sigla)
    .whereIn('tb_categoria.id_categoria', idCategoria)
    .where('tb_ProdutoComercial.en_SitCarencia', 0)
    .where('nu_cdVendedor4E_tk', 0)
    .where('nu_cdCorretoraS4E_tk', 0)
    .orderBy('tb_formaspgtoIF.vl_valor', 'asc')
    .distinct()
    .first() || new TbParceiro;
  }

  async getPlanWithTokenCompany(sigla: string, token: string, idsCategoria: number[]): Promise<TbParceiro> {
    const parceiro = await TbParceiro
    .query()
    .preload('produtoComercial', (query) => {
      query.preload('formasPagamentoEmpresa')
    })
    .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
    .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
    .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
    .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
    .leftJoin('tb_formaspgtoCol', 'tb_formaspgtoCol.id_prodcomerc_fc', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
    .where('tb_ProdutoComercial.nu_PublicaInt', 1)
    .where('tb_ProdutoComercial.en_status', 1)
    .where('tb_UF.sigla', sigla)
    .whereIn('tb_categoria.id_categoria', idsCategoria)
    .where('tb_tokenidparc.cd_Codtokenidparc', token)
    .orderBy('tb_formaspgtoCol.vl_valor', 'asc')
    .distinct()
    .first();

    if (!parceiro?.produtoComercial.formasPagamentoEmpresa[0].vl_valor) {
      throw new PlanoNaoEncontrado();
    }

    return parceiro;
  }

  async getBasicPlanCompany(sigla: string, idsCategoria: number[]): Promise<TbParceiro> {
    return await TbParceiro
    .query()
    .preload('produtoComercial', (query) => {
      query.preload('formasPagamentoEmpresa')
    })
    .leftJoin('tb_tokenidparc', 'tb_tokenidparc.nu_IdParceiro_tk', 'tb_parceiro.id_parceiro')
    .innerJoin('tb_ProdutoComercial', 'tb_ProdutoComercial.id_prodcomerc', 'tb_parceiro.id_prodcomerc_pr')
    .innerJoin('tb_ModProduto', 'tb_ModProduto.id_modproduto', 'tb_ProdutoComercial.id_modproduto_c')
    .leftJoin('tb_AbrangRegiao', 'tb_AbrangRegiao.id_prodcomerc_abr', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_categoria', 'tb_categoria.id_categoria', 'tb_ProdutoComercial.id_categoria_c')
    .leftJoin('tb_TipoPreco', 'tb_TipoPreco.id_TipoPreco', 'tb_ProdutoComercial.id_TipoPreco_c')
    .leftJoin('tb_formaspgtoCol', 'tb_formaspgtoCol.id_prodcomerc_fc', 'tb_ProdutoComercial.id_prodcomerc')
    .innerJoin('tb_UF', 'tb_AbrangRegiao.id_uf_r', 'tb_UF.id_uf')
    .where('tb_ProdutoComercial.nu_PublicaInt', 1)
    .where('tb_ProdutoComercial.en_status', 1)
    .where('tb_UF.sigla', sigla)
    .whereIn('tb_categoria.id_categoria', idsCategoria)
    .where('tb_ProdutoComercial.en_SitCarencia', 0)
    .where('nu_cdVendedor4E_tk', 0)
    .where('nu_cdCorretoraS4E_tk', 0)
    .orderBy('tb_formaspgtoCol.vl_valor', 'asc')
    .distinct()
    .first() || new TbParceiro;
  }
  
}
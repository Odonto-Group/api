import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class TokenService {
  async isTokenValido(token: any): Promise<boolean> {
    const tok = await TbTokenIdParc.query().where('cd_Codtokenidparc', token).first()
    return !!tok
  }

  async findTokenParceiroIndividual(token: string): Promise<TbTokenIdParc> {
    const tokenIdParc = await TbTokenIdParc
    .query()
    .preload('parceiro', (query) => {
      query.preload('produtoComercial', (query) => {
        query.preload('categoria')
        .preload('formasPagamentoIndividual', (query => {
          query.preload('meioPagamentoIndividual')
        }))
      })
    })
    .preload('vendedor')
    .preload('corretora')
    .where('cd_Codtokenidparc', token)
    .first();

    return tokenIdParc || new TbTokenIdParc;
  }

  async findTokenParceiroEmpresa(token: string): Promise<TbTokenIdParc> {
    const tokenIdParc = await TbTokenIdParc
    .query()
    .preload('parceiro', (query) => {
      query.preload('produtoComercial', (query) => {
        query.preload('categoria')
        .preload('produtoS4E')
        .preload('formasPagamentoEmpresa', (query => {
          query.preload('meioPagamentoEmpresa')
        }))
      })
    })
    .preload('vendedor')
    .preload('corretora')
    .where('cd_Codtokenidparc', token)
    .first();

    return tokenIdParc || new TbTokenIdParc;
  }
  
}
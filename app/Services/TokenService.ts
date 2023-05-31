import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class TokenService {
  async isTokenValido(token: any): Promise<boolean> {
    const tok = await TbTokenIdParc.query().where('cd_Codtokenidparc', token).first()
    return !tok
  }

  async findToken(token: string): Promise<TbTokenIdParc> {
    const returne = await TbTokenIdParc
    .query()
    .preload('parceiro', (query) => {
      query.preload('produtoComercial', (query) => {
        query.preload('categoria')
        .preload('formasPagamento', (query => {
          query.preload('meioPagamento')
        }))
      })
    })
    .preload('vendedor')
    .preload('corretora')
    .where('cd_Codtokenidparc', token)
    .first();

    return returne || new TbTokenIdParc;
  }
  
}
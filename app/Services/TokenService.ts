import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class TokenService {

  async findParceiro(token: string): Promise<TbParceiro> {
    const tokenId = await TbTokenIdParc
    .query()
    .preload('parceiro', (query) => {
      query.preload('produtoComercialParceiro')
    })
    .where('cd_Codtokenidparc', token)
    .first();

    return tokenId?.parceiro || new TbParceiro;
  }
  
}
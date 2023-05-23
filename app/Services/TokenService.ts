import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class TokenService {

  async findParceiro(token: string): Promise<TbParceiro> {
    const tokenId = await TbParceiro
    .query()
    .preload('tokenidparc')
    .where('id_parceiro', 676)
    .first(); 

    return tokenId || new TbParceiro;
  }
  
}
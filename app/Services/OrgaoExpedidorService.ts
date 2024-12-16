import PlanoNaoEncontrado from 'App/Exceptions/PlanoNaoEncontrado';
import TbOrgaoExpedidor from 'App/Models/TbOrgaoExpedidor';


export default class OrgaoExpedidorService {

  async getOrgaoExpedidorbySigla(orgao: string): Promise<TbOrgaoExpedidor>{
    const orgaoExp = await TbOrgaoExpedidor
    .query()
    .where('sigla', orgao)
    .firstOrFail();

    if (!orgaoExp) {
      throw new PlanoNaoEncontrado();
    }
    return orgaoExp;
  }
  
  
}
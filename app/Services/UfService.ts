
import TbUf from 'App/Models/TbUf';

export default class UfService {

  async findUfBySigla(siglaUf: string): Promise<TbUf> {
    const uf = await TbUf 
    .query()
    .where("sifla", siglaUf)
    .first();

    return uf || new TbUf;
  }
}
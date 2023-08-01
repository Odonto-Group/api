
import TbUf from 'App/Models/TbUf';

export default class UfService {

  async findUfBySigla(siglaUf: string): Promise<TbUf> {
    const uf = await TbUf 
    .query()
    .where("sigla", siglaUf)
    .first();

    return uf || new TbUf;
  }

  async findUfById(idUf: number): Promise<TbUf> {
    const uf = await TbUf 
    .query()
    .where("id_uf", idUf)
    .first();

    return uf || new TbUf;
  }

  
  async isUFValido(siglaUf: number): Promise<boolean> {
    const uf = await TbUf 
    .query()
    .where("sigla", siglaUf)
    .first();

    return !uf;
  }
}
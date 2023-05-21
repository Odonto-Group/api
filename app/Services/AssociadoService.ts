import TbAssociado from 'App/Models/TbAssociado';
import TbParceiro from 'App/Models/TbParceiro';
import TbTokenIdParc from 'App/Models/TbTokenIdParc';

export default class AssociadoService {

  async findAssociado(cpfAssociado: string): Promise<TbAssociado> {
    const associado = await TbAssociado
    .query()
    .where("nu_cpf", cpfAssociado)
    .first();

    return associado || new TbAssociado;

  }
  
}
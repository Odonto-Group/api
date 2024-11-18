import GDFAssertiva from "App/Models/GDFAssertiva";
export default class GDFAssertivaService {

  async getByCpf(cpf: string): Promise<GDFAssertiva | null> {
    const Associado = await GDFAssertiva
    .query()
    .where('CPF', cpf)
    .first();

    return Associado;
  }
}
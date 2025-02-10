import ServGDFC from "App/Models/ServGDFC";
export default class ServGDFCService {

  async getByCpf(matricula: string): Promise<ServGDFC | null> {
    const Associado = await ServGDFC.query().where('Matric_Servidor', matricula).first();

    return Associado;
  }
}
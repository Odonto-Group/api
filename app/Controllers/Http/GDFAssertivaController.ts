import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import GDFAssertivaService from 'App/Services/GDFAssertivaService';
import ServGDFCService from 'App/Services/ServGDFCService';
import AssertivaService from 'App/Services/AssertivaService';
import ServidorNaoEncontrado from 'App/Exceptions/ServidorNaoEncontrado';

@inject()
export default class GDFAssertivaController {
  constructor(
    private readonly GDFAssertivaService: GDFAssertivaService,
    private readonly ServGDFCService: ServGDFCService,
    private readonly Assertiva: AssertivaService
  ) { }

  async getDadosAssociado({ request, response }: HttpContextContract) {
    
    const params = request.all();
    const data = await this.GDFAssertivaService.getByCpf(params.cpf);
    let associado = {};
    if (!data){
      const Gdf = await this.ServGDFCService.getByCpf(params.matricula);
      if(!Gdf){
        throw new ServidorNaoEncontrado()
      } else {
        const servidor = await this.Assertiva.getAssertivaCPFDetails(params.cpf);
        console.log('consulta assertiva: ', servidor);
        if (servidor){
          associado = {
            nome: servidor.resposta.dadosCadastrais.nome,
            cpf: servidor.resposta.dadosCadastrais.cpf.replace(/[.-]/g, ''),
            data_nasc: servidor.resposta.dadosCadastrais.dataNascimento,
            sexo: servidor.resposta.dadosCadastrais.sexo == 'Masculino' ? "M" : "F",
            telefone: servidor.resposta.telefones.moveis[0]?.numero.replace(/[()\s-]/g, ''),
            email: servidor.resposta.emails[0]?.email,
            nome_mae: servidor.resposta.dadosCadastrais.maeNome,
            cep: servidor.resposta.enderecos[0]?.cep.replace('-', ''),
            numero: servidor.resposta.enderecos[0]?.numero,
            complemento: servidor.resposta.enderecos[0]?.complemento
          }
        } else {
          associado = {
            cpf: params.cpf.trim(),
          }
        }
      }
    } else{
      console.log('data: ', data.$extras);
      associado = {
        nome: data.$extras.NOME,
        cpf: data.$extras.CPF,
        data_nasc: data.$extras.DATA_NASCIMENTO,
        sexo: data.$extras.SEXO,
        telefone: data.$extras.CELULAR1,
        email: data.$extras.EMAIL1,
        nome_mae: data.$extras.MAE_NOME,
        cep: data.$extras.ENDERECO_01_CEP,
        numero: data.$extras.NUMERO1,
        complemento: data.$extras.COMPLEMENTO1
      }
    }
    return response.json(associado);
  }
}

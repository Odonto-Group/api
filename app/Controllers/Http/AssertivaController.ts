import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import AssertivaService from 'App/Services/AssertivaService';
//import { encryptData } from 'App/utils/cryptoUtils';

@inject()
export default class AssertivaController {
  constructor(
    private readonly assertivaService: AssertivaService,
  ) { }

  async getAssertivaInfo({ request, response }: HttpContextContract) {

    const data = await this.assertivaService.getAssertivaCPFDetails(request.params().cpf);
    console.log('data: ', data);
    if (!data.resposta.dadosCadastrais || data.erro) {
      return response.json({ message: 'Problema ao buscar informações!' });
    }

    const responseData = {
      nome: data.resposta.dadosCadastrais.nome,
      dataNascimento: data.resposta.dadosCadastrais.dataNascimento,
      maeNome: data.resposta.dadosCadastrais.maeNome,
    };

    //const encryptedResponse = encryptData(JSON.stringify(responseData));

    //return response.json({ data: encryptedResponse});
    return response.json({
      nome: data.resposta.dadosCadastrais.nome,
      dataNascimento: data.resposta.dadosCadastrais.dataNascimento,
      maeNome: data.resposta.dadosCadastrais.maeNome,
    });
  }
}

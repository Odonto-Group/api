import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import AssertivaService from 'App/Services/AssertivaService';

@inject()
export default class AssertivaController {
  constructor(
    private readonly assertivaService: AssertivaService,
  ) { }

  async getAssertivaInfo({ request, response }: HttpContextContract) {

    const data = await this.assertivaService.getAssertivaCPFDetails(request.params().cpf);

    if (data.status === 500 || data.status === 404 || data.erro) {
      return response.json({ message: 'Problema ao buscar informações!' });
    }
    return response.json({nome: data.resposta.dadosCadastrais.nome, dataNascimento: data.resposta.dadosCadastrais.dataNascimento, maeNome: data.resposta.dadosCadastrais.maeNome});
  }
}

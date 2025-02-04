import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import AssociadoService from 'App/Services/AssociadoService';
import ApiV3Service from 'App/Services/ApiV3';

@inject()
export default class CarenciaController {
  constructor(
    private readonly apiV3: ApiV3Service
  ) { }

  async testeCarencia({ request, response }: HttpContextContract){
    const params =  request.all();
    const cd_empresa = params.empresa;
    try{
      await this.apiV3.createCarenciaPME(cd_empresa, '2024-12-17T10:32:22.546-03:00');
      return response.json('ok');
    } catch(error) {
      console.log(error.message);
      return response.json(error.message);
    }
  }
}



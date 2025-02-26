import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import FixInsertService from 'App/Services/FixInsertService';

@inject()
export default class fixController {
  constructor(
    private readonly fixService: FixInsertService
  ) { }

  async fixlogs({request,  response }: HttpContextContract) {
    const params =  request.all();
    await this.fixService.processErrorLogs(params.start, params.end);
    response.json('ok');
  }
}



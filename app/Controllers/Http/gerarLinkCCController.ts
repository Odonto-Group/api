import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';import LinkCCService from 'App/Services/LinkCCService';
;

@inject()
export default class gerarLinkCCController {
  constructor(
    private readonly LinkCCService: LinkCCService
  ) { }

  async fixlogs({request,  response }: HttpContextContract) {    
    const retorno = await this.LinkCCService.processErrors();
    response.json(retorno);
  }
  async GenerateLinkIndividual({request,  response }: HttpContextContract) {
    const params = request.all();
    const retorno = await this.LinkCCService.ProcessAssociado(params.cpf);
    response.json(retorno);
  }
}
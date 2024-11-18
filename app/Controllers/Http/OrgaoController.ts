import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import OrgaoService from 'App/Services/OrgaoService';

@inject()
export default class OrgaoController {
  constructor(
    private readonly orgaoService: OrgaoService,
  ) { }

  async getOrgaoInfo({ request, response }: HttpContextContract) {
    
    const params = request.all();
    const data = await this.orgaoService.getOrgaoWithMatricCodOrgao(params.matric, params.codOrgao);
    console.log('retorno', data.$extras);
    
    return response.json(data.$extras);
  }
  
  async getOrgaobyId({ request, response }: HttpContextContract) {
    const params = request.all();
    console.log('chegou:', params);
    const data = await this.orgaoService.getOrgaoWithCodOrgao(params.id);
    console.log('retorno', data.$original);
    
    return response.json(data.$original);
  }

  async getOrgaobyFP({ request, response }: HttpContextContract) {
    
    const params = request.all();
    const data = await this.orgaoService.getOrgaoWithFP(params.id);
    console.log('retorno', data);
    
    return response.json(data);
  }
}

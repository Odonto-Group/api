import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import OrgaoExpedidorService from 'App/Services/OrgaoExpedidorService';
import UfService from 'App/Services/UfService';

@inject()
export default class enderecosIdController {
  constructor(
    private readonly orgaoExpedidorService: OrgaoExpedidorService,
    private readonly ufService: UfService,
  ) { }

  async getEnderecoInfo({ request, response }: HttpContextContract) {
    const params = request.all();
    const orgaoExpedidor = await this.orgaoExpedidorService.getOrgaoExpedidorbySigla(params.OrgaoExpedidor);
    const uf = await this.ufService.findUfBySigla(params.OrgaoExpedidorUf);
    
    return response.json({orgaoExpedidor: orgaoExpedidor, uf: uf});
  }
  
}

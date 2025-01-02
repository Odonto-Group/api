import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { inject } from '@adonisjs/fold';
import S4EService from 'App/Services/S4EService';
import DependentValidator from 'App/Validators/DependentValidator';

@inject()
export default class DependentController {
  constructor(
    private readonly S4eService: S4EService,
  ) { }

  async index({ request, response }: HttpContextContract) {
    
    const params = await request.validate(DependentValidator);
    const data = await this.S4eService.includeDependents(params);
    
    return response.json(data);
  }
}

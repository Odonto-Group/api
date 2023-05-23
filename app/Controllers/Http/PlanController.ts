import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import { PlansName } from 'App/Enums/PlansName';
import { Category } from 'App/Enums/Category';
import PlanService from 'App/Services/PlanService';

@inject()
export default class PlanController {

  private planService: PlanService;

  constructor(planService: PlanService) {
      this.planService = planService
  }

  async index({ request, response }: HttpContextContract) {
    request.params().state = request.params().state || 'DF'
    
    const parceiro =  await this.planService.getPlan(request.params().state , PlansName.ODONTO_CLINICO, Category.PESSOA_FISICA)

    return parceiro
  }
  
}

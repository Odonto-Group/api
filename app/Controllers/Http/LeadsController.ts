import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import LeadsService from "App/Services/LeadsService";

@inject()
export default class LeadsController {
    private leadsService: LeadsService;

    constructor(leadsService: LeadsService) {
      this.leadsService = leadsService
    }

    async index({ response }: HttpContextContract) {

        try {
            const leads = await this.leadsService.all()
            return leads;
        } catch (error) {
            return response.unauthorized(error.message)
        }
        
    }

    async update({ request, response }: HttpContextContract) {

        // try {
        //     const leads = await this.leadsService.all()
        //     return leads;
        // } catch (error) {
        //     return response.unauthorized(error.message)
        // }
        
    }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import LeadsService from "App/Services/LeadsService";
import LogStatusService from "App/Services/LogStatusService";
import StatusService from "App/Services/StatusService";
import Database from '@ioc:Adonis/Lucid/Database';
import LeadUpdateValidator from 'App/Validators/LeadUpdateValidator';

@inject()
export default class LeadsController {
    private leadsService: LeadsService;
    private logStatusService: LogStatusService;
    private statusService: StatusService;

    constructor(leadsService: LeadsService, logStatusService: LogStatusService, statusService: StatusService) {
      this.leadsService = leadsService
      this.logStatusService = logStatusService
      this.statusService = statusService
    }

    async index({ response }: HttpContextContract) {

        try {
            const leads = await this.leadsService.all()
            return leads;
        } catch (error) {
            return response.unauthorized(error.message)
        }
        
    }

    async getLeadStatus({ response }: HttpContextContract){
        
        try {
            const statusService = await this.statusService.all()
            return statusService;
        } catch (error) {
            return response.unauthorized(error.message)
        }
    }

    async update({ auth, request, response }: HttpContextContract) {
        
        const data = await request.validate(LeadUpdateValidator)
        const lead_id = data.lead;
        const status = data.status;
        const user_id = auth.use('api').user.id;
        try {
            await this.logStatusService.registerLeadLogStatus(lead_id, status, user_id)
            const leadUpdated = await this.leadsService.updateSendStatus(lead_id,);
            return leadUpdated;

        } catch (error) {
            return response.unauthorized(error.message)
        }
        
    }
    
}

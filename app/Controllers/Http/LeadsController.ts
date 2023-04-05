import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import LeadsService from "App/Services/LeadsService";
import LogStatusService from "App/Services/LogLeadStatusService";
import StatusService from "App/Services/StatusLeadService";
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

    async index({ request, response }: HttpContextContract) {
        const pageNumber = request.params().pageNumber
        const itemsPerPage = request.params().itemsPerPage   

        try {
            const leads = await this.leadsService.getPerPage(pageNumber, itemsPerPage)
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
    
    async getOneLeadStatus({ request, response }: HttpContextContract){
        const lead = request.params().lead

        try {
            const statusService = await this.statusService.getByLead(lead)
            return statusService;
        } catch (error) {
            return response.unauthorized(error.message)
        }
    }

    async update({ auth, request, response }: HttpContextContract) {
        
        const data = await request.validate(LeadUpdateValidator)
        const lead_id = data.lead;
        const status_primario = data.status_primario;
        const status_secundario = data.status_secundario;
        const mensagem = data.mensagem;
        const user_id = auth.use('api').user?.id;
        try {
            await this.logStatusService.registerLeadLogStatus(lead_id, status_primario, status_secundario, user_id, mensagem)
            const leadUpdated = await this.leadsService.updateSendStatus(lead_id);
            return leadUpdated;

        } catch (error) {
            return response.unauthorized(error.message)
        }
        
    }
    
}

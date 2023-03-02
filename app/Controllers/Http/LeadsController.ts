import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TbLeads from 'App/Models/TbLeads';

export default class LeadsController {
    
    async index({ request, response }: HttpContextContract) {

        try {
            const leads = await TbLeads.all()
            return leads;
        } catch (error) {
            return response.unauthorized(error.message)
        }
        
    }
}

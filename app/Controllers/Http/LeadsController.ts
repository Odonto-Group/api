import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LeadsController {
    
    async index({ request, response }: HttpContextContract) {

        try {
            const leads = await Database
                .from('tb_leads') // 👈 gives an instance of select query builder
                .select('*');
            return leads;
        } catch (error) {
            return response.unauthorized(error.message)
        }
        
    }
}

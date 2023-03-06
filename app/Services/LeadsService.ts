import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import TbLeads from 'App/Models/TbLeads';


export default class LeadsService {
  
  async all(  ): Promise<any> {
    const leads = await TbLeads.all()
    return leads;
  }
  
}
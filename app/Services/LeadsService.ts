import TbLeads from 'App/Models/TbLeads';


export default class LeadsService {
  
  async all(  ): Promise<any> {
    const leads = await TbLeads.all()
    return leads;
  }

  async updateSendStatus(lead_id: number):  Promise<any> {
    
    const lead = await TbLeads.findOrFail(lead_id)
    lead.enviou = true
    await lead.save()
    return { id: lead.id_leads, enviou: lead.enviou }
  }
  
}
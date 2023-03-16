import TbLeads from 'App/Models/TbLeads';
import TbLeadStatus from 'App/Models/TbLeadStatus';


export default class StatusLeadService {
  
  async all(): Promise<any> {
    const leads = await TbLeadStatus.all()
    return leads;
  }

  async getOne(id: number): Promise<any> {
    const lead = await TbLeadStatus.find(id)
    return lead;
  }

  async getByLead(id_lead: number): Promise<any> {
    const lead = await TbLeads.query().where('id_leads', id_lead).preload('statusLeadsPrimario').preload('statusLeadsSecundario'); 
    console.log(lead)
    return lead;
  }
  
}
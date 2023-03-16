import TbLeads from 'App/Models/TbLeads';


export default class LeadsService {
  
  async all(  ): Promise<any> {
    const leads = await  TbLeads.query().preload('statusLeadsSecundario', (query) => {
      query.orderBy('updated_at', 'desc').groupLimit(1);
    }); 
    return leads;
  }

  async getPerPage(pageNumber:number, itemsPerPage:number): Promise<any> {
    const leads = await TbLeads.query().preload('statusLeadsSecundario', (query) => {
      query.orderBy('updated_at', 'desc').groupLimit(1);
    }).paginate(pageNumber, itemsPerPage)
    return leads;

  }

  async getStatusByLead( id_lead:number ): Promise<any> {
    const lead = await TbLeads.query().where('id_leads', id_lead).preload('statusLeadsPrimario').preload('statusLeadsSecundario'); 
    return lead;
  }

  async updateSendStatus(lead_id: number):  Promise<any> {
    
    const lead = await TbLeads.findOrFail(lead_id)
    lead.enviou = true
    await lead.save()
    return { id: lead.id_leads, enviou: lead.enviou }
  }
  
}
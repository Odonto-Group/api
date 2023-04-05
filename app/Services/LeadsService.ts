import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import TbLeads from 'App/Models/TbLeads';


export default class LeadsService {
  
  async all(  ): Promise<any> {
    const leads = await  TbLeads.query().preload('statusLeadsSecundario', (query) => {
      query.orderBy('tb_log_leads_status_sec.updated_at', 'desc');
    }); 
    return leads;
  }

  async getPerPage(pageNumber:number, itemsPerPage:number): Promise<any> {
    const leads = await TbLeads.query().preload('statusLeadsSecundario', (query) => {
      query.groupOrderBy('tb_log_leads_status_sec.updated_at', 'desc').groupLimit(1);
    }).paginate(pageNumber, itemsPerPage)
    return leads; 

  }

  async getStatusByLead( id_lead:number ): Promise<any> {
    const lead = await TbLeads.query().where('id_leads', id_lead).preload('statusLeadsPrimario').preload('statusLeadsSecundario'); 
    return lead;
  }
  
  async registerLead(data: Object, trx: TransactionClientContract): Promise<any> {
    const lead = await TbLeads.create(data, { client: trx });
    return lead;
  }
  
  async updateSendStatus(lead: TbLeads):  Promise<any> {
    lead.enviou = true
    await lead.save()
    return lead;  
  }
  
}
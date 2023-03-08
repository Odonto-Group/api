import TbLeadStatus from 'App/Models/TbLeadStatus';


export default class StatusLeadService {
  
  async all(): Promise<any> {
    const leads = await TbLeadStatus.all()
    return leads;
  }
  
}
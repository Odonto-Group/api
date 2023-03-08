import Status from 'App/Models/Status';


export default class StatusService {
  
  async all(): Promise<any> {
    const leads = await Status.all()
    return leads;
  }
  
}
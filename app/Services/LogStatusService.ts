import LogStatus from 'App/Models/LogStatus'



export default class LogStatusService {
  
  async registerLeadLogStatus(lead_id: number, status: Array<number>, user_id: number) : Promise<any> {
    
    await Promise.all(status.map(statusCode => {
      return LogStatus.create({
        user_id : user_id,
        id_lead : lead_id,
        id_status : statusCode,
      })
    }));
   
  }
}
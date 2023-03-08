import TbLogLeadStatus from 'App/Models/TbLogLeadStatus'



export default class LogLeadStatusService {
  
  async registerLeadLogStatus(lead_id: number, status: Array<number>, user_id: number, mensagem : string | undefined) : Promise<any> {
    
    await Promise.all(status.map(statusCode => {
      return TbLogLeadStatus.create({
        user_id : user_id,
        id_lead : lead_id,
        id_status : statusCode,
        mensagem : mensagem
      })
    }));
   
  }
}
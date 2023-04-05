import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import TbLogLeadStatusPrimario from 'App/Models/TbLogLeadStatusPrimario';
import TbLogLeadStatusSecundario from 'App/Models/TbLogLeadStatusSecundario'



export default class LogLeadStatusService {
  
  async registerLeadLogStatus(id_lead: number, status_primario: Array<number>, status_secundario: Array<number>, user_id: number | undefined, mensagem : string | undefined) : Promise<any> {
    
    const log_status_primario_result = await this.registerStatusTable(status_primario, id_lead, user_id, TbLogLeadStatusPrimario);
    await this.registerStatusTable(status_secundario, id_lead, user_id, TbLogLeadStatusSecundario, mensagem, log_status_primario_result.id);
    
  }

  async registerStatusTable( status : Array<number>, id_lead: number,  user_id: number | undefined, table : typeof BaseModel,  mensagem: string | undefined = undefined, id_status_primario: number | undefined = undefined ) {

    const instance = new table();
    const data = {
      user_id : user_id,
      id_lead : id_lead,
    }

    if(mensagem){
      data['mensagem'] = mensagem;
    }
    if(id_status_primario){
      data['id_status_primario'] = id_status_primario;
    }

    await Promise.all(status.map(statusCode => {
      data['id_status'] = statusCode;
      return instance.fill(data).save();
    }));

    return instance;
  }
}
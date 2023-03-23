import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export default class ApiViaMaisService {

  private http;

  constructor(){
    
    this.http = axios.create({
      baseURL: Env.get('URL_API_VIA_MAIS'),
      headers: {
          "Content-Type": "application/json",
          "Authorization" :`Bearer ${Env.get('TOKEN_API_VIA_MAIS')}`
      },
    })
   
  }
  
  async sendLead( data: Object ): Promise<any> {  
    const params = {
      name: data.nome,
      phone_number: data.telefone,
      source: data.origem,
    }

    const result = await this.http.post('', params)

    console.log(result);
    return result.data;

  }
  
}
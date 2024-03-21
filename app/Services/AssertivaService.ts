import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'

export default class AssertivaService {
  private urlBaseAssertiva = Env.get('ASSERTIVA_BASE_URL')
  private userAssertiva = Env.get('ASSERTIVA_USER')

  async getAssertivaToken() {
    try {

      const response = await axios.post(`${this.urlBaseAssertiva}/oauth2/v3/token?grant_type=client_credentials`,{}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Authorization': `${this.userAssertiva}`,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    } catch (erro) {
      return false
    }
  }

  async getAssertivaCPFDetails(cpf: string) {
    try {
      const token = await this.getAssertivaToken();

      const response = await axios.get(`${this.urlBaseAssertiva}/localize/v3/cpf?cpf=${cpf}&idFinalidade=1`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + `${token.access_token}`,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    } catch (erro) {
      return false
    }
  }
}
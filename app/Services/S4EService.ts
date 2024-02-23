import { default as axios } from 'axios'
import { inject } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import ErroInclusaoAssociadoS4EException from 'App/Exceptions/ErroInclusaoAssociadoS4EException'

@inject()
export default class S4EService {
  private s4eInclude = Env.get('S4E_URL_INCLUSAO')
  private s4eToken = Env.get('SE4_TOKEN')

  constructor() {}

  async includeAssociado(body: any) {
    try {
      const response = await axios.post(`${this.s4eInclude}`, body, {
        headers: {
          'token': `${this.s4eToken}`,
        },
      })

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      throw new ErroInclusaoAssociadoS4EException()
    }
  }
}

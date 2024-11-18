import { default as axios } from 'axios'
import { inject } from '@adonisjs/core/build/standalone'
import { validator } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import ErroInclusaoAssociadoS4EException from 'App/Exceptions/ErroInclusaoAssociadoS4EException'
import EnderecoS4e from 'App/interfaces/EnderecoS4e'
import EnderecoValidator from 'App/Validators/EnderecoValidator'

@inject()
export default class S4EService {
  private s4eInclude = Env.get('S4E_URL_INCLUSAO')
  private s4eToken = Env.get('SE4_TOKEN')
  private s4eIncludePj = Env.get('S4E_URL_INCLUSAO_PJ')
  private s4eTokenV1 = Env.get('S4E_TOKEN_V1')
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
  async includeAssociadoPJ(body: any) {
    try {
      const response = await axios.post(`${this.s4eIncludePj}vendedor/NovoUsuarioPJ?token=${this.s4eTokenV1}`, body)
      console.log("retorno", response);
      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      console.log('error message includeAssociadoPJ: ', error.message);
      throw new ErroInclusaoAssociadoS4EException()
    }
  }

  async getEnderecoByCep(cep: string): Promise<EnderecoS4e> {
  try {
    // Fazendo a requisição para a API externa
    const response = await axios.post(`${this.s4eIncludePj}redeatendimento/Endereco?token=${this.s4eTokenV1}&cep=${cep}`)
    console.log("Retorno da API:", response.data.dados);

    // Verifica o status da resposta
    if (response.status !== 200) {
      throw new Error('Erro ao buscar endereço')
    }

    // Acessando os dados da propriedade "dados"
    const endereco = response.data.dados;

    // Validando os dados recebidos com o EnderecoValidator
    const enderecoValidado = await  await validator.validate({
      schema: new EnderecoValidator().schema,
      data: endereco
    });

    // Retorna o endereço validado
    return enderecoValidado;

  } catch (error) {
    console.error('Erro ao buscar endereço por CEP:', error.message)
    // Caso seja um erro geral, lança a exceção personalizada
    throw new ErroInclusaoAssociadoS4EException()
  }
}

  async includeCrm(body: any) {
    try {
      const response = await axios.post(`${this.s4eIncludePj}chamado/novochamado`, body)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      throw new ErroInclusaoAssociadoS4EException()
    }
  }
  async includeOcorrencia(body: any) {
    try {
      const response = await axios.post(`${this.s4eIncludePj}?token=${this.s4eTokenV1}`, body)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      console.log('error message includeAssociadoPJ: ', error.message);
      throw new ErroInclusaoAssociadoS4EException()
    }
  }
}

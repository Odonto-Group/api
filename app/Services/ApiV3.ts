import { default as axios, AxiosResponse } from 'axios'
import { inject } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import ErroInclusaoAssociadoS4EException from 'App/Exceptions/ErroInclusaoAssociadoS4EException'

@inject()
export default class ApiV3Service {
  private UrlBase = Env.get('APIV3_URL')
  private User = Env.get('APIV3_USER')
  private password = Env.get('APIV3_SENHA')
  constructor() {}

  async getToken() {
    try {
      console.log('dados: ', this.User, this.password);
      const response = await axios.get(`${this.UrlBase}/login?user=${this.User}&password=${this.password}`);

      if (response.status === 200) {
        return response.data.token;
      } else {
        console.log('Error getToken ApiV3', response);
        throw new Error('Erro ao solicitar Token Api V3');
      }
    } catch (error) {
      console.log('Erro ao solicitar Token Api V3: ' , error.message);
      throw new Error('Erro ao solicitar Token Api V3: ' + error.message);
    }
  }

  async createCarenciaPME(cd_empresa: string, inicio: string) {
    const token = await this.getToken();
    if (token){
      try {
        const response: AxiosResponse = await axios.post(
          `${this.UrlBase}/carencia?empresa=${cd_empresa}&date=${inicio}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log('error message createCarencias: ', error.message);
        throw new ErroInclusaoAssociadoS4EException()
      }
    } else {
      throw Error('Erro ao solicitar Token Api V3 na chamada carencias ');
    }   
  }
  async getDadosMail(cpf: string) {
    const token = await this.getToken();
    if (token){
      try {
        const response: AxiosResponse = await axios.get(
          `${this.UrlBase}/dadosEmail?cpf=${cpf}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          return response.data;
        } else {
          throw Error(response.data.Error);
        }
      } catch (error) {
        console.log('error message GetDadosMail: ', error.message);
        throw new ErroInclusaoAssociadoS4EException()
      }
    } else {
      throw Error('Erro ao solicitar Token Api V3 na chamada de dados e-mail');
    }   
  }
  async getAssocsMail() {
    const token = await this.getToken();
    if (token){
      try {
        const response: AxiosResponse = await axios.get(
          `${this.UrlBase}/AssocEmail`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          return response.data;
        } else {
          throw Error(response.data.Error);
        }
      } catch (error) {
        console.log('error message GetAssocsMail: ', error.message);
        throw new Error('Erro ao na chamada Assoc E-mail: ' + error.message);
      }
    } else {
      throw new Error('Erro ao solicitar Token Api V3 na chamada de Assoc e-mail');
    }   
  }

  /* async getEnderecoByCep(cep: string): Promise<EnderecoS4e> {
  try {
    const response = await axios.post(`${this.s4eIncludePj}redeatendimento/Endereco?token=${this.s4eTokenV1}&cep=${cep}`)
    console.log("Retorno da consulta do cep:", response.data.dados);

    if (response.status !== 200) {
      throw new Error('Erro ao buscar endereço')
    }

    const endereco = response.data.dados;

    const enderecoValidado = await  await validator.validate({
      schema: new EnderecoValidator().schema,
      data: endereco
    });

    return enderecoValidado;

  } catch (error) {
    console.error('Erro ao buscar endereço por CEP:', error.message)
    throw new ErroConsultaCepS4EException()
  }
}

async includeEmpresa(body: any) {
  try {
    const response = await axios.post(`${this.s4eIncludePj}api/empresa/NovaEmpresa`, body);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log('error message includeAssociadoPJ: ', error.message);
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
  } */
}

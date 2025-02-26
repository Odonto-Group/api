import { default as axios } from 'axios'
import { inject } from '@adonisjs/core/build/standalone'
import { validator } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import ErroInclusaoAssociadoS4EException from 'App/Exceptions/ErroInclusaoAssociadoS4EException'
import EnderecoS4e from 'App/interfaces/EnderecoS4e'
import EnderecoValidator from 'App/Validators/EnderecoValidator'
import ErroConsultaCepS4EException from 'App/Exceptions/ErroConsultaCepS4EException'

@inject()
export default class S4EService {
  private s4eInclude = Env.get('S4E_URL_INCLUSAO')
  private s4eToken = Env.get('SE4_TOKEN')
  private s4eIncludePj = Env.get('S4E_URL_INCLUSAO_PJ')
  private s4eSys = Env.get('S4E_URL_SYS')
  private s4eApiV2 = Env.get('S4E_URL_API_V2')
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
    } catch (error: any) {
      throw new ErroInclusaoAssociadoS4EException()
    }
  }
  async includeAssociadoPJ(body: any) {
    try {
      const response = await axios.post(`${this.s4eIncludePj}vendedor/NovoUsuarioPJ?token=${this.s4eTokenV1}`, body)
      if (response.status === 200) {
        if(response.data.codigo == 1){
          return response.data
        } else {
          throw new Error(response.data.mensagem);
        }
      } else {
        throw new Error('Erro na inclusão do associadoPJ' + response.status);
      }
    } catch (error: any) {
      console.log('error message includeAssociadoPJ: ', error.message);
      throw new Error('Erro na inclusão do associadoPJ, mensagem: ' + error.message);
    }
  }

  async getEnderecoByCep(cep: string): Promise<EnderecoS4e> {
  try {
    console.log('cep enviado: ', cep);
    const response = await axios.post(`${this.s4eIncludePj}redeatendimento/Endereco?token=${this.s4eTokenV1}&cep=${cep}`)
    console.log("Retorno da consulta do cep:", response);

    if (response.status !== 200) {
      throw new Error('Erro ao buscar endereço')
    }

    const endereco = response.data.dados;

    const enderecoValidado =  await validator.validate({
      schema: new EnderecoValidator().schema,
      data: endereco
    });

    return enderecoValidado;

  } catch (error: any) {
    console.error('Erro ao buscar endereço por CEP:', error.message)
    throw new ErroConsultaCepS4EException()
  }
}
  async getAssociadoById(cod: number) {
  try {
    const response = await axios.get(`${this.s4eApiV2}Associados?token=${this.s4eTokenV1}&codigoAssociado=${cod}`)
        if (response.status !== 200) {
      throw new Error('Erro ao buscar Associado: ' + response.data.title)
    }
    if (!response.data.dados[0]){
      throw new Error('Associado não encontrado');
    }
    const retorno = response.data.dados[0];

    return retorno;

  } catch (error: any) {
    console.error('Erro ao Associado S4e:', error.message)
    throw new Error(error.message);
  }
}
  async getAssociadoByCpf(cpf: string) {
  try {
    const response = await axios.get(`${this.s4eApiV2}Associados?token=${this.s4eTokenV1}&cpfAssociado=${cpf}`)
        if (response.status !== 200) {
      throw new Error('Erro ao buscar Associado: ' + response.data.title)
    }
    if (!response.data.dados[0]){
      throw new Error('Associado não encontrado');
    }
    const retorno = response.data.dados[0];

    return retorno;

  } catch (error: any) {
    console.error('Erro ao Associado S4e:', error.message)
    throw new Error(error.message);
  }
}
  async getAssociadoByCpfGDF(cpf: string) {
  try {
    const response = await axios.get(`${this.s4eApiV2}Associados?token=${this.s4eTokenV1}&cpfAssociado=${cpf}`)
        if (response.status !== 200) {
      throw new Error('Erro ao buscar Associado: ' + response.data.title)
    }
    const retorno = response.data.dados.find((x: any) => x.codigoDaEmpresa == 27855);

    if (!retorno){
      throw new Error('Associado não encontrado');
    }; 
    return retorno;

  } catch (error: any) {
    console.error('Erro ao Buscar Associado S4e:', error.message)
    throw new Error(error.message);
  }
}

async getAssociadoByCpfProposta(cpf: string) {
  try {
    const response = await axios.get(`${this.s4eApiV2}Associados?token=${this.s4eTokenV1}&cpfAssociado=${cpf}`)
        if (response.status !== 200) {
      throw new Error('Erro ao buscar Associado: ' + response.data.title)
    }
    
    const retorno = response.data.dados.find((x: any) => 
      x.dependentes.some((dep: any) => dep.codigoGrauParentesco == 1 && dep.codigoSituacao == 1)
  );
    if (!retorno){
      throw new Error('Associado não encontrado');
    }
    return retorno;

  } catch (error: any) {
    console.error('Erro ao Associado S4e:', error.message)
    throw new Error(error.message);
  }
}

async includeEmpresa(body: any) {
  try {
    const response = await axios.post(`${this.s4eIncludePj}empresa/NovaEmpresa`, body);
    if (response.data.codigo === 1) {
      return response.data;
    } else {
      console.log('retorno Api com erro: ', response);
      throw new Error('Erro ao incluir empresa: ' + response.data.mensagem);
    }
  } catch (error: any) {
    console.log('error message includeEmpresa: ', error.message);
    throw new Error('Erro ao incluir empresa: ' + error.message);
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
    } catch (error: any) {
      throw new ErroInclusaoAssociadoS4EException()
    }
  }
  async includeOcorrencia(body: any) {
    try {
      const response = await axios.post(`${this.s4eSys}Vendedor.aspx/NovaOcorrencia`, body)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error: any) {
      console.log('error message includeAssociadoPJ: ', error.message);
      throw new ErroInclusaoAssociadoS4EException()
    }
  }
  async includeDependents(body: any) {
    try {
      const response = await axios.post(`${this.s4eIncludePj}vendedor/NovoDependente`, body)
      if (response.status === 200) {
        if(response.data.codigo == 1){
          return response.data
        } else {
          throw new Error('Erro na inclusão dos Dependentes, mensagem: ' + response.data.mensagem);
        }
      } else {
        throw new Error('Erro na inclusão dos Dependentes' + response.status);
      }
    } catch (error: any) {
      //console.log('error message includeAssociadoPJ: ', error.message);
      throw new Error(error.message);
    }
  }
}

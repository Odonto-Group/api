import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'
import { MailSenderService } from './MailSenderService';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import { inject } from '@adonisjs/core/build/standalone';

@inject()
export default class FileService {
  private linkEnvContrato = Env.get('LINK_CONTRATO')
  private linkArquivoIndividualDependente = Env.get('LINK_ARQUIVO_INDIVIDUAL_DEPENDENTE')
  private nomeArquivoIndividualDependente = Env.get('COMPROVANTE_VINCULO_INDIVIDUAL_DEPENDENTE_ARQUIVO')

  private linkArquivoEmpresaDependente = Env.get('LINK_ARQUIVO_EMPRESA_DEPENDENTE')
  private nomeArquivoEmpresaDependente = Env.get('COMPROVANTE_VINCULO_EMPRESA_DEPENDENTE_ARQUIVO')

  constructor(
  ) {}

  async buscarContrato(idContrato: number) {
    const url = this.linkEnvContrato.replace("{idContrato}", idContrato);

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const file = Buffer.from(response.data, 'binary');

      return file;
    } catch (error) {
      console.log("Arquivo não encontrado.");
      
    }
  }
  
  async salvarArquivoIndividualDependente(idDependente: number, arquivo: MultipartFileContract, idAssociado: number) {
    try {
      if (arquivo && arquivo.tmpPath) {
        const nomeArquivo = this.nomeArquivoIndividualDependente.replace("idDependente", idDependente.toString());
        const caminhoArquivo = this.linkArquivoIndividualDependente.replace("idAssociado", idAssociado.toString());
    
        // Garantir que o diretório de destino exista
        await fsExtra.ensureDir(caminhoArquivo);
    
        const url = path.join(caminhoArquivo, nomeArquivo);
    
        await fsExtra.move(arquivo.tmpPath, url);
      }
    } catch(ex) {
      console.log()
    }
    
  }

  async salvarArquivoEmpresaDependente(idDependente: number, arquivo: any, idAssociado: number) {
    const nomeArquivo = this.nomeArquivoEmpresaDependente.replace("idDependente", idDependente)
    const caminhoArquivo = this.linkArquivoEmpresaDependente.replace("idAssociado", idAssociado)

    // garantia de que o diretoriio de destino exista
    await fsExtra.ensureDir(caminhoArquivo);

    const url = path.join(caminhoArquivo, nomeArquivo);

    await fsExtra.move(arquivo.path, url);

    return url;
  }


}

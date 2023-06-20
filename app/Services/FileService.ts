import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/core/build/standalone';

@inject()
export default class FileService {

  async buscarContrato(idContrato: number) {
    const linkEnv = Env.get('LINK_CONTRATO')

    const url = linkEnv.replace("{idContrato}", idContrato);

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const file = Buffer.from(response.data, 'binary');
      return file;
    } catch (error) {
      console.log('Error downloading file:', error);
    }
  }

}

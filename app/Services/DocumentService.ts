import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs/promises'

export default class DocumentService {
    
    async uploadImage(file: any, id: string | number, destino: string | null = null) {
        const ext = file.extname;
        const filename = `${Date.now()}.${ext}`;
        
        let path = `files/vendas/${id}/${filename}`;
      
        if(destino){
          switch(destino){
            case 'servidor':
              path = `files/vendas/${id}/contracheque/${filename}`;
              break;
            case 'dependente':
              path = `files/vendas/${id}/dependentes/${filename}`;
              break;
            default:
              path = `files/vendas/${id}/${filename}`;
              break;
          }
        }
        
        const fileContents = await fs.readFile(file.tmpPath, { encoding: 'base64' });

        await Drive.put(path, fileContents, {contentEncoding: 'base64'});
    }
}
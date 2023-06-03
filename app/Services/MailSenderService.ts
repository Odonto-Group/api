import mailerConfig from 'Config/mailerConfig';
import Env from '@ioc:Adonis/Core/Env'
import ErroAoEnviarEmailException from 'App/Exceptions/ErroAoEnviarEmailException';
import * as fs from 'fs';
import * as path from 'path';

export class MailSenderService {
  async sendEmailAdesao(
        to: string,
        subject: string,
        contentView: any,
      ) {
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', `AdesaoTemplate.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', `instagram-logo.png`));
        
        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');

        // Substituir os campos dinâmicos no HTML
        let finalHtmlContent = htmlContent;

        for (const key in contentView) {
            const value = contentView[key];
            finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        const mailOptions = {
          from: Env.get('MAIL_FROM'),
          bcc: Env.get('MAIL_BCC'),
          to,
          subject,
          html: finalHtmlContent,
          attachments: [
            {
              filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
              content: capa,
              cid: 'capa' // Identificador para referenciar a imagem no HTML
            },
            {
              filename: 'linkedin-logo.png',
              content: linkedin,
              cid: 'linkedin' // Identificador para referenciar a imagem no HTML
            },
            {
              filename: 'instagram-logo.png',
              content: instagram,
              cid: 'instagram' // Identificador para referenciar a imagem no HTML
            },
            {
              filename: 'odonto-group.png',
              content: odontoGroup,
              cid: 'odontoGroup' // Identificador para referenciar a imagem no HTML
            },
            {
              filename: 'ANS.png',
              content: ans,
              cid: 'ans' // Identificador para referenciar a imagem no HTML
            }
          ]
        };
      
        try {
          await mailerConfig.sendMail(mailOptions);
        } catch (error) {
          throw new ErroAoEnviarEmailException(to);
        }
      };
}
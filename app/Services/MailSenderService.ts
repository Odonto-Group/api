import mailerConfig from 'Config/mailerConfig';
import Env from '@ioc:Adonis/Core/Env'
import ErroAoEnviarEmailException from 'App/Exceptions/ErroAoEnviarEmailException';
import * as fs from 'fs';
import * as path from 'path';
import ErroEmailContent from 'App/interfaces/ErroEmailContent.interface';

export class MailSenderService {


  async sendEmailPagamentoAprovado(
      to: string,
      subject: string,
      contentView: PagamentoEmailContent
    ) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'pagamento', `PagamentoTemplate.html`);
      const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `capa-pessoas.png`));
      const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `linkedin-logo.png`));
      const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `ANS.png`));
      const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `odonto-group.png`));
      const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `instagram-logo.png`));
      const apple = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `apple-logo.png`));
      const android = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `android-logo.png`));
      const telefone = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `telefone.png`));

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
          },
          {
            filename: 'apple-logo.png',
            content: apple,
            cid: 'apple' // Identificador para referenciar a imagem no HTML
          },
          {
            filename: 'android-logo.png',
            content: android,
            cid: 'android' // Identificador para referenciar a imagem no HTML
          },
          {
            filename: 'telefone.png',
            content: telefone,
            cid: 'telefone' // Identificador para referenciar a imagem no HTML
          }
        ]
      };
    
      try {
        await mailerConfig.sendMail(mailOptions);
      } catch (error) {
        throw new ErroAoEnviarEmailException(to);
      }
  }

  async sendEmailAdesaoBoleto(
        to: string,
        subject: string,
        contentView: AdesaoEmailContent
      ) {
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `AdesaoTemplate.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `instagram-logo.png`));
        
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

      async sendEmailAdesaoCartao(
        to: string,
        subject: string,
        contentView: AdesaoEmailContent
      ) {
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'cartao', `AdesaoTemplate.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'cartao', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'cartao', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'cartao', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'cartao', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'cartao', `instagram-logo.png`));
        
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

      async sendEmailErro(
        to: string,
        subject: string,
        contentView: ErroEmailContent,
      ) {
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', `ErroSuporte.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', `instagram-logo.png`));
        
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
import mailerConfig from 'Config/mailerConfig';
import Env from '@ioc:Adonis/Core/Env'
import ErroAoEnviarEmailException from 'App/Exceptions/ErroAoEnviarEmailException';
import * as fs from 'fs';
import * as path from 'path';
import ErroEmailContent from 'App/interfaces/ErroEmailContent.interface';
import FileService from './FileService';
import { inject } from '@adonisjs/core/build/standalone';
import AdesaoEmailContent from 'App/interfaces/AdesaoEmailContent.interface';

@inject()
export class MailSenderService {

  private emailSuporteOdontoGroup = Env.get('EMAIL_ODONTO_GROUP_SUPORTE')
  private emailDefaultTeste = Env.get('EMAIL_ENVIO_DEFAULT')

  constructor(
    private fileService: FileService
  ) {}

  async sendEmailPagamentoAprovado(
      to: string,
      subject: string,
      idContrato: number,
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

      const file = await this.fileService.buscarContrato(idContrato);

      if (!file) {
        const planoContent = {
          CONTRATOID: idContrato
        } as ContratoNaoEncontradoEmailContent;
  
        await this.sendEmailErroContratoNaoEncontrado(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro buscar contrato OdontoGroup.', planoContent)
      }

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
          },
          {
            filename: 'contrato.pdf', // nome que você quer dar ao anexo
            content: file
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

      async sendEmailAdesaoSemLinkPagamento(
        to: string,
        subject: string,
        contentView: AdesaoEmailContent
      ) {
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `AdesaoTemplate.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `instagram-logo.png`));

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
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `ErroPagamentoSuporte.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `instagram-logo.png`));
        
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

      async sendEmailErroContratoNaoEncontrado(
        to: string,
        subject: string,
        contentView: ContratoNaoEncontradoEmailContent,
      ) {
        const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `ContratoNaoEncontrado.html`);
        const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `capa-mulher.png`));
        const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `linkedin-logo.png`));
        const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `ANS.png`));
        const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `odonto-group.png`));
        const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `instagram-logo.png`));
        
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

    async sendEmailEmpresaPlano(to: string,
      subject: string,
      contentView: EmpresaPlanoContent) {
      const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `EmpresaPlanoTemplate.html`);
      const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `capa-mulher.png`));
      const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `linkedin-logo.png`));
      const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `ANS.png`));
      const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `odonto-group.png`));
      const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `instagram-logo.png`));

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
    }
}
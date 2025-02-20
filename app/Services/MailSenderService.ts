import mailerConfig from 'Config/mailerConfig';
import Env from '@ioc:Adonis/Core/Env'
import ErroAoEnviarEmailException from 'App/Exceptions/ErroAoEnviarEmailException';
import * as fs from 'fs';
import * as path from 'path';
import ErroEmailContent from 'App/interfaces/ErroEmailContent.interface';
import FileService from './FileService';
import { inject } from '@adonisjs/core/build/standalone';
import AdesaoEmailContent from 'App/interfaces/AdesaoEmailContent.interface';
import { GrupoPagamento } from 'App/Enums/GrupoPagamento';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import TbAssociado from 'App/Models/TbAssociado';
import ErroInclusaoEmailContent from 'App/interfaces/ErroEmailContent.interface';
import ApiV3Service from './ApiV3';
import ProdutoComercialService from './ProdutoComercialService';
import formatDateToBrazil from 'App/utils/formatDate';
import formatNumberBrValue from 'App/utils/FormatNumber';
import AssociadoService from './AssociadoService';

@inject()
export class MailSenderService {

  private readonly emailSuporteOdontoGroup: string = Env.get('EMAIL_ODONTO_GROUP_SUPORTE');
  private readonly emailDefaultTeste: string = Env.get('EMAIL_ENVIO_DEFAULT');
  private readonly emailOuvidoria: string = Env.get('EMAIL_ODONTO_OUV');
  private readonly fromEmail: string;
  private readonly bccEmail: string;

  constructor(
    private readonly produtoService: ProdutoComercialService,
    private readonly ApiV3: ApiV3Service,
    private fileService: FileService,
    private readonly associadoService: AssociadoService
  ) {
    this.fromEmail = Env.get('MAIL_FROM');
    this.bccEmail = Env.get('MAIL_BCC');
  }

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
  async sendEmailAdesaoConsignado(
    to: string,
    subject: string,
    idContrato: number,
    idContratoDependent: number[] | null,
    contentView: AdesaoEmailContent
  ) {
    const htmlFilePath = path.join(
      __dirname,
      '..',
      '..',
      'email',
      'adesao',
      'Consignado',
      `AdesaoTemplate.html`
    );

    // Anexar contrato principal
    const file = await this.fileService.buscarContrato(idContrato);
    if (!file) {
      return ErroAoEnviarEmailException;
    };
    const regularAttachments = [
      {
        filename: 'contrato.pdf',
        content: file,
      },
    ];
  
    if (idContratoDependent) {
      for (const id of idContratoDependent) {
        const dependentFile = await this.fileService.buscarContrato(id);
        if (dependentFile) {
          regularAttachments.push({
            filename: `contratoDependente${id}.pdf`,
            content: dependentFile,
          });
        }
      }
    }
  
    const attachments = [...regularAttachments];
  
    const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
    let finalHtmlContent = htmlContent;
    for (const key in contentView) {
      const value = contentView[key];
      finalHtmlContent = finalHtmlContent.replace(
        new RegExp(`{{${key}}}`, 'g'),
        value
      );
    }
  
    const mailOptions = {
      from: Env.get('MAIL_FROM'),
      bcc: [Env.get('MAIL_BCC'), 'odontogroup.2018@gmail.com', 'fiscais@odontogroup.com.br'],
      to,
      subject,
      html: finalHtmlContent,
      attachments,
    };
  
    try {
      await mailerConfig.sendMail(mailOptions);
    } catch (error) {
      throw new ErroAoEnviarEmailException(to);
    }
  }
  
  async findFilesById(directory: string, id: string): Promise<string[]> {
    try {
        // Lê o conteúdo do diretório
        const files = await fs.promises.readdir(directory);

        // Filtra os arquivos que contêm o ID no nome
        const matchingFiles = files.filter(file => file.includes(id));

        return matchingFiles;
    } catch (error) {
        console.error('Erro ao ler o diretório:', error);
        throw error;
    }
  }

  async getmailGDF(cpf: string){
    try{
      const associado = await this.ApiV3.getDadosMail(cpf);      
      const titular = associado.dados.find(x => x.CD_GRAU_PARENTESCO == 1);
      const associadoVO = await this.associadoService.findAssociadoByCpf(cpf);
      if(titular){
        const plano = await this.getPlanoS4e(titular.cd_plano);
        const dependentsPlan: number[] = Array.from(
          new Set(
            associado.dados
              .filter(x => x.CD_GRAU_PARENTESCO !== 1)
              .map(x => x.cd_plano)
          )

        );
        const dependentsPlanId: number[] = [];
        for (const planId of dependentsPlan) {
          const result = await this.getPlanoS4e(planId); 
          dependentsPlanId.push(result.id_prodcomerc);
        }
        const mensalidade: number = associado.dados
        .reduce((sum, x) => sum + x.vl_plano, 0);
        const vigencia = formatDateToBrazil(titular.dt_assinatura_contrato);
        const planoContent = {
          NOMEPLANO: plano.nm_prodcomerc,
          DATAVENCIMENTO: vigencia,
          NOMECLIENTE: titular.NM_DEPENDENTE,
          LINKPAGAMENTO: associadoVO ? String(associadoVO.id_associado) : String(titular.CD_SEQUENCIAL),
          VALORPLANO: formatNumberBrValue(mensalidade),
          METODOPAGAMENTO: FormaPagamento.CONSIGNADO
        } as AdesaoEmailContent;
        console.log('plano: ', plano.id_prodcomerc);
        console.log('dependentes planos: ', dependentsPlanId);
        //await this.sendEmailAdesaoConsignado('erick.calza@odontogroup.com.br', 'Bem-vindo à OdontoGroup.', plano.id_prodcomerc, dependentsPlanId, planoContent);
        await this.sendEmailAdesaoConsignado(titular.email, 'Bem-vindo à OdontoGroup.', plano.id_prodcomerc, dependentsPlanId, planoContent);
        return true;
      } else {
        throw new Error('não foi possivel enviar o email');
      }
    } catch(error) {
      throw new Error('não foi possivel enviar o email' + error.message);
    }
  }

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

  async sendMailError(associado: TbAssociado, grupo: number, id: string){
    
    const GrupoPagamentoToFormaPagamentoMap: Record<GrupoPagamento, FormaPagamento> = {
      [GrupoPagamento.BOLETO]: FormaPagamento.BOLETO,
      [GrupoPagamento.CARTAO_CREDITO]: FormaPagamento.CARTAO_CREDITO,
      [GrupoPagamento.DEBITO_EM_CONTA]: FormaPagamento.DEBITO_EM_CONTA,
      [GrupoPagamento.CONSIGNADO]: FormaPagamento.CONSIGNADO,
    };
    if (!Object.values(GrupoPagamento).includes(grupo)) {
      throw new Error(`GrupoPagamento inválido: ${grupo}`);
    }

    const grupoPagamentoNome = grupo as GrupoPagamento;
    const formaPagamentoNome = GrupoPagamentoToFormaPagamentoMap[grupoPagamentoNome];
    const telefone = '(' + associado.nu_dddCel + ') ' + associado.$extras.nu_Celular;
  
    const emailConfig = {
      NOMECLIENTE: associado.nm_associado,
      CPF: associado.nu_cpf,
      EMAIL: associado.ds_email,
      TELEFONE: telefone,
      TIPO_PAGAMENTO: formaPagamentoNome
    } as ErroInclusaoEmailContent;
    await this.sendEmailErroInclusao('erick.calza@odontogroup.com.br', 'erro na inclusão do associado', emailConfig, id);
  }

  async sendEmailErroInclusao(
    to: string,
    subject: string,
    contentView: ErroInclusaoEmailContent,
    id: string,
  ) {
    const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `ErroInclusao.html`);
    const pastaLog = path.join(__dirname, '..', '..', 'logs', 'individual');

    const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');

    // Substituir os campos dinâmicos no HTML
    let finalHtmlContent = htmlContent;

    const attachments: any = [];
    const logEntrada = await this.findFilesById(pastaLog + '/entradas', id);
    const logApi = await this.findFilesById(pastaLog + '/RetornosApi', id);
    const logSaida = await this.findFilesById(pastaLog + '/saidas', id);
    const logErros = await this.findFilesById(pastaLog + '/erros', id);
    console.log('Retornos Logs: ', logEntrada[0], logApi[0], logSaida[0], logErros[0]);
    if (logEntrada[0]) {
      const entrada = await fs.promises.readFile(path.join(__dirname, '..', '..', 'logs', 'individual', 'entradas', logEntrada[0]));
      const arquivo = {
        filename: id + '_Entrada.json', 
        content: entrada
      }
      attachments.push(arquivo);
    }
    if (logApi[0]) {
      const RetornoApi = await fs.promises.readFile(path.join(__dirname, '..', '..', 'logs', 'individual', 'RetornosApi', logApi[0]));
      const arquivo = {
        filename: id + '_RetornoApi.json', 
        content: RetornoApi
      }
      attachments.push(arquivo);
    }
    if (logSaida[0]) {
      const saida = await fs.promises.readFile(path.join(__dirname, '..', '..', 'logs', 'individual', 'saidas', logSaida[0]));
      const arquivo = {
        filename: id + '_Saida.json', 
        content: saida
      }
      attachments.push(arquivo);
    }
    if (logErros[0]) {
      const count = logErros.length;
      const erro = await fs.promises.readFile(path.join(__dirname, '..', '..', 'logs', 'individual', 'erros', logErros[count - 1]));
      const arquivo = {
        filename: id + '_Erro.json', 
        content: erro
      }
      attachments.push(arquivo);
    }
    for (const key in contentView) {
      const value = contentView[key];
      finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const mailOptions = {
      from: Env.get('MAIL_FROM'),
      bcc: [Env.get('MAIL_BCC'), 'odontogroup.2018@gmail.com'],
      to,
      subject,
      html: finalHtmlContent,
      attachments: attachments
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
    const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `ErroInclusao.html`);
    const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `capa-mulher.png`));
    const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `linkedin-logo.png`));
    const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `ANS.png`));
    const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `odonto-group.png`));
    const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'inclusao', `instagram-logo.png`));

    const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');

    // Substituir os campos dinâmicos no HTML
    let finalHtmlContent = htmlContent;

    for (const key in contentView) {
      const value = contentView[key];
      finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const mailOptions = {
      from: Env.get('MAIL_FROM'),
      bcc: [Env.get('MAIL_BCC'), 'odontogroup.2018@gmail.com'],
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

  async sendOuvidoria(data: Record<string, any>) {
    const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'ouvidoria', `OuvidoriaTemplate.html`);
    const capa = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `capa-mulher.png`));
    const linkedin = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `linkedin-logo.png`));
    const ans = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `ANS.png`));
    const odontoGroup = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `odonto-group.png`));
    const instagram = await fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `instagram-logo.png`));
  
    const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
  
    let finalHtmlContent = htmlContent;
  
    // Substitui os placeholders do HTML com os dados enviados
    for (const key in data) {
      const value = data[key];
      finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  
    const to = this.emailOuvidoria;
    const userEmail = data.email;  // O e-mail preenchido no formulário
  
    // Criação das opções de e-mail, incluindo o e-mail do usuário
    const mailOptions = {
      from: this.fromEmail,
      bcc: this.bccEmail,
      to: [to, userEmail],  // Envia para o e-mail do usuário e também para o destinatário principal
      subject: `Ouvidoria - ${data.subject ?? data.name}`,
      html: finalHtmlContent,
      attachments: [
        {
          filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
          content: capa,
          cid: 'capa'
        },
        {
          filename: 'linkedin-logo.png',
          content: linkedin,
          cid: 'linkedin'
        },
        {
          filename: 'instagram-logo.png',
          content: instagram,
          cid: 'instagram'
        },
        {
          filename: 'odonto-group.png',
          content: odontoGroup,
          cid: 'odontoGroup'
        },
        {
          filename: 'ANS.png',
          content: ans,
          cid: 'ans'
        }
      ]
    };
  
    try {
      await mailerConfig.sendMail(mailOptions);
    } catch (error) {
      throw new ErroAoEnviarEmailException(to);
    }
  }

  async getPlano(plano) {
    try {
      const planoData = await this.produtoService.getById(plano);
      if(planoData){
        return planoData;
      } else {
        throw Error('Plano Não encontrado.' + plano);
      }
    } catch (error) {
      console.error("Erro ao buscar o plano:", error);
      throw Error('Plano Não encontrado.' + plano);
    }
  }
  async getPlanoS4e(plano) {
    try {
      const planoData = await this.produtoService.getByS4eId(plano);
      if(planoData){
        return planoData;
      } else {
        throw Error('Plano Não encontrado.' + plano);
      }
    } catch (error) {
      console.error("Erro ao buscar o plano:", error);
      throw Error('Plano Não encontrado.' + plano);
    }
  }
}
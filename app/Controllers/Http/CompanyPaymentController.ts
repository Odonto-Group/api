import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import Env from '@ioc:Adonis/Core/Env'
import TokenInvalidoException from 'App/Exceptions/TokenInvalidoException';
import TokenService from 'App/Services/TokenService';
import TbEmpresa from 'App/Models/TbEmpresa';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import FuncionarioService from 'App/Services/FuncionarioService';
import EmpresaService from 'App/Services/EmpresaService';
import EmpresaComPlanoJaCadastrado from 'App/Exceptions/EmpresaComPlanoJaCadastrado';
import FormasPagamentoService from 'App/Services/FormasPagamentoService';
import FormaPagamentoNaoEncontrada from 'App/Exceptions/FormaPagamentoNaoEncontrada';
import { DateTime } from 'luxon';
import DataExpiracaoInvalida from 'App/Exceptions/DataExpiracaoInvalida';
import DependenteFuncionalService from 'App/Services/DependenteFuncionalService';
import FluxoPagamentoBoletoEmpresa from 'App/Services/Fluxo/Pagamento/FluxoPagamentoBoletoEmpresa';
import { FormaPagamento } from 'App/Enums/FormaPagamento';
import TbProdutoComercial from 'App/Models/TbProdutoComercial';
import { MailSenderService } from 'App/Services/MailSenderService';
import ResponsavelEmpresaService from 'App/Services/ResponsavelEmpresaService';
import TbCategoria from 'App/Models/TbCategoria';
import QuantidadeDeVidasAbaixoDoMinimo from 'App/Exceptions/QuantidadeDeVidasAbaixoDoMinimo';
import QuantidadeDeVidasAcimaDoMaximo from 'App/Exceptions/QuantidadeDeVidasAcimaDoMaximo';
import formatNumberBrValue from 'App/utils/FormatNumber';
import RetornoGeracaoPagamentoEmpresa from 'App/interfaces/RetornoGeracaoPagamentoEmpresa.interface';
import CompanyPaymentValidator from 'App/Validators/CompanyPaymentValidator';
import LogService from 'App/Services/Log/Log';
import Application from '@ioc:Adonis/Core/Application'

@inject()
export default class CompanyPaymentController {

  private emailSuporteOdontoGroup = Env.get('EMAIL_ODONTO_GROUP_SUPORTE')
  private emailDefaultTeste = Env.get('EMAIL_ENVIO_DEFAULT')

  constructor(
    private mailSenderService: MailSenderService,
    private tokenService: TokenService,
    private funcionarioService: FuncionarioService,
    private empresaService: EmpresaService,
    private formasPagamentoService: FormasPagamentoService,
    private dependenteFuncionalService: DependenteFuncionalService,
    private fluxoPagamentoBoletoEmpresa: FluxoPagamentoBoletoEmpresa,
    private logService: LogService,
    private responsavelEmpresaService: ResponsavelEmpresaService
  ) {
    this.logService = new LogService();
  } 

  async index({ request }: HttpContextContract) {
    const params = request.all()

    const planoContent = {
        CNPJ: params.cnpj,
        EMAIL_PARA_CONTATO: params.emailContato, 
        NOME_EMPRESA: params.nomeEmpresa,
        NOME_PARA_CONTATO: params.nomeContato,
        QUANTIDADE_DE_VIDAS: params.quantidadeVidas,
        TELEFONE_PARA_CONTATO: params.telefoneContato
      } as EmpresaPlanoContent;

    await this.mailSenderService.sendEmailEmpresaPlano(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Assinatura plano empresarial', planoContent)

    return "Email de adesão empresárial enviado com sucesso."
  }

  async fluxoPagamentoPlanoEmpresa({ request, response }: HttpContextContract) {
    
    const entrada = request.all();
    const tipoRequisicao = 'Pagamento';
    const Id = entrada.proposta || 0;

    this.logService.writeLog(Id, tipoRequisicao, { local:'empresarial', type: 'entrada', data: entrada });
    await Database.transaction(async (transaction) => {
      try {
        const retorno = await this.iniciarFluxoPagamentoPlanoEmpresa(request, transaction);
        this.logService.writeLog(Id == 0 ? retorno.numeroProposta : Id , tipoRequisicao, { local:'empresarial', type: 'saida', data: retorno });
        transaction.commit();

        return retorno;
      } catch (error) {
        this.logService.writeLog(Id, tipoRequisicao, { local:'empresarial', type: 'erro', data: error });
        transaction.rollback();
        throw error;
      }
    })
  }

  async iniciarFluxoPagamentoPlanoEmpresa(request: RequestContract, transaction: TransactionClientContract) {
    const params = await request.validate(CompanyPaymentValidator)
    const token = params.token

    if(token && !(await this.tokenService.isTokenValido(token))) {
        throw new TokenInvalidoException();
    }

    const tokenParceiro = await this.tokenService.findTokenParceiroEmpresa(token);

    const parceiro = tokenParceiro.parceiro
    
    const produtoComercial = parceiro.produtoComercial

    const empresa = await this.empresaService.buscarEmpresa(params.empresa.cnpj);

    if (empresa.cd_status && empresa.cd_status != 0) {
      throw new EmpresaComPlanoJaCadastrado();
    }

    const formaPagamento = await this.formasPagamentoService.findFormaPagamentoEmpresa(produtoComercial.id_prodcomerc)
    
    if (!formaPagamento) {
      throw new FormaPagamentoNaoEncontrada();
    }

    let dataPrimeiroVencimento = DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy");

    if (dataPrimeiroVencimento.startOf('day') < DateTime.now().startOf('day')) {
      throw new DataExpiracaoInvalida();
    }

    let valorMensalidade = formaPagamento.vl_valor;

    let quantidadeVidas = this.calcularQuantidadeVidas(params)

    const categoria = produtoComercial.categoria

    this.validaQuantidadeVidas(quantidadeVidas, categoria);
    
    const valorContrato = valorMensalidade * quantidadeVidas

    await this.empresaService.saveEmpresa(empresa, params, valorContrato, dataPrimeiroVencimento, tokenParceiro.vendedor.id_vendedor, produtoComercial, transaction)
    
    await this.responsavelEmpresaService.deleteResponsavelEmpresaByIdEmpresa(empresa.id_cdempresa, transaction);

    await this.responsavelEmpresaService.saveResponsavelEmpresa(params, empresa, transaction);

    await this.funcionarioService.deleteFuncionarioEDependentesByIdEmpresa(empresa.id_cdempresa, transaction)

    await this.saveFuncionario(params, empresa, produtoComercial, transaction);

    let retunPayment = await this.fluxoPagamentoBoletoEmpresa.iniciarFluxoPagamento({empresa, dataPrimeiroVencimento, transaction, nomePlano: produtoComercial.nm_prodcomerc, produtoComercial, formaPagamento: FormaPagamento.BOLETO_EMPRESA, params})

    return this.criarRetornoPagamento(retunPayment, empresa, quantidadeVidas, valorContrato, produtoComercial.nm_prodcomerc,  tokenParceiro.vendedor.tx_nome, dataPrimeiroVencimento);
  }

  private async criarRetornoPagamento(returnPayment: RetornoGeracaoPagamentoEmpresa, empresa: TbEmpresa, quantidadeVidas: number, valorContrato: number, nomePlano: string, nomeVendedor: string, dataPrimeiroVencimento: DateTime) {
    console.log('chegou aqui');
    returnPayment.idEmpresa = empresa.id_cdempresa
    returnPayment.dataCadastro = empresa.DT_CADASTRO
    returnPayment.email = empresa.ds_email
    returnPayment.numeroProposta = empresa.nr_proposta
    returnPayment.nome = empresa.nm_nome_fantasia
    returnPayment.quantidadeVidas = quantidadeVidas;
    returnPayment.valorPagamento = formatNumberBrValue(valorContrato)
    returnPayment.nomePlano = nomePlano;
    returnPayment.telefone = empresa.nu_dddcel + empresa.nu_celular
    returnPayment.nomeVendedor = nomeVendedor
    returnPayment.linkProposta = `https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/2/${empresa.id_cdempresa}`
    returnPayment.dataVencimento = dataPrimeiroVencimento.toString()
    returnPayment.ddd = empresa.nu_dddcel
    returnPayment.pagamentoStatus = empresa.cd_status
    console.log('enviou: ', returnPayment);
    return returnPayment;
  }

  async saveFuncionario(params: any, empresa: TbEmpresa, produtoComercial: TbProdutoComercial, transaction: TransactionClientContract) {
    if (params.funcionarios) {
      for (const funcionario of params.funcionarios) {
        const funcionarioInserido = await this.funcionarioService.saveFuncionario(funcionario, empresa, produtoComercial, transaction);
  
        if (funcionario.dependentes) {
          for (const dependente of funcionario.dependentes) {
            await this.dependenteFuncionalService.saveDependenteFuncional(empresa, funcionarioInserido, dependente, transaction);
          }
        }
      }
    }
  }

  calcularQuantidadeVidas(params: any) {
    let quantidade = 0

    params.funcionarios && params.funcionarios.map(async (funcionario: any) => {
      quantidade += 1
    
      funcionario.dependentes && funcionario.dependentes.map(async (_: any) => {
        quantidade += 1
      });
    });

    return quantidade;
  }

  validaQuantidadeVidas(numeroVidas: number, categoria: TbCategoria) {
    if (categoria.nu_vidas_min && numeroVidas < categoria.nu_vidas_min) {
      throw new QuantidadeDeVidasAbaixoDoMinimo()
    }
    if (categoria.nu_vidas_max && numeroVidas > categoria.nu_vidas_max) {
      throw new QuantidadeDeVidasAcimaDoMaximo()
    }
  }

  public async uploadFiles( request: RequestContract ) {

    // Processar arquivos na raiz
    const rootFiles = ['CNPJCard', 'CSMei', 'ComprovanteResi', 'Identidade']
    for (const fileTag of rootFiles) {
      const file = request.file(fileTag, {
        extnames: ['pdf', 'jpg', 'jpeg'],
        size: '2mb',
      })

      if (file) {
        if (!file.isValid) {
          throw new Error(file.errors.toString());
        }
        await file.move(Application.tmpPath('uploads'))
      }
    }

    // Processar arquivos de funcionários e dependentes
    const funcionarios = request.input('funcionarios', [])
    for (const funcionario of funcionarios) {
      const funcionarioFile = request.file(`funcionario_${funcionario.id}_file`, {
        extnames: ['pdf', 'jpg', 'jpeg'],
        size: '2mb',
      })

      if (funcionarioFile) {
        if (!funcionarioFile.isValid) {
          throw new Error(funcionarioFile.errors.toString());
        }
        await funcionarioFile.move(Application.tmpPath('uploads'))
      }

      const dependentes = funcionario.dependentes || []
      for (const dependente of dependentes) {
        const dependenteFile = request.file(`dependente_${dependente.id}_file`, {
          extnames: ['pdf', 'jpg', 'jpeg'],
          size: '2mb',
        })

        if (dependenteFile) {
          if (!dependenteFile.isValid) {
            throw new Error(dependenteFile.errors.toString());
          }
          await dependenteFile.move(Application.tmpPath('uploads'))
        }
      }
    }


    return true;
  }

}

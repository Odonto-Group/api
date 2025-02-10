"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fold_1 = require("@adonisjs/fold");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const TokenInvalidoException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/TokenInvalidoException"));
const TokenService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/TokenService"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const FuncionarioService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/FuncionarioService"));
const EmpresaService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/EmpresaService"));
const EmpresaComPlanoJaCadastrado_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/EmpresaComPlanoJaCadastrado"));
const FormasPagamentoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/FormasPagamentoService"));
const FormaPagamentoNaoEncontrada_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/FormaPagamentoNaoEncontrada"));
const luxon_1 = require("luxon");
const DataExpiracaoInvalida_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/DataExpiracaoInvalida"));
const DependenteFuncionalService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/DependenteFuncionalService"));
const FluxoPagamentoBoletoEmpresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Pagamento/FluxoPagamentoBoletoEmpresa"));
const FormaPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/FormaPagamento");
const MailSenderService_1 = global[Symbol.for('ioc.use')]("App/Services/MailSenderService");
const ResponsavelEmpresaService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/ResponsavelEmpresaService"));
const QuantidadeDeVidasAbaixoDoMinimo_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/QuantidadeDeVidasAbaixoDoMinimo"));
const QuantidadeDeVidasAcimaDoMaximo_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/QuantidadeDeVidasAcimaDoMaximo"));
const FormatNumber_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/FormatNumber"));
const CompanyPaymentValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CompanyPaymentValidator"));
let CompanyPaymentController = class CompanyPaymentController {
    constructor(mailSenderService, tokenService, funcionarioService, empresaService, formasPagamentoService, dependenteFuncionalService, fluxoPagamentoBoletoEmpresa, responsavelEmpresaService) {
        this.mailSenderService = mailSenderService;
        this.tokenService = tokenService;
        this.funcionarioService = funcionarioService;
        this.empresaService = empresaService;
        this.formasPagamentoService = formasPagamentoService;
        this.dependenteFuncionalService = dependenteFuncionalService;
        this.fluxoPagamentoBoletoEmpresa = fluxoPagamentoBoletoEmpresa;
        this.responsavelEmpresaService = responsavelEmpresaService;
        this.emailSuporteOdontoGroup = Env_1.default.get('EMAIL_ODONTO_GROUP_SUPORTE');
        this.emailDefaultTeste = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
    }
    index({ request }) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = request.all();
            const planoContent = {
                CNPJ: params.cnpj,
                EMAIL_PARA_CONTATO: params.emailContato,
                NOME_EMPRESA: params.nomeEmpresa,
                NOME_PARA_CONTATO: params.nomeContato,
                QUANTIDADE_DE_VIDAS: params.quantidadeVidas,
                TELEFONE_PARA_CONTATO: params.telefoneContato
            };
            yield this.mailSenderService.sendEmailEmpresaPlano(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Assinatura plano empresarial', planoContent);
            return "Email de adesão empresárial enviado com sucesso.";
        });
    }
    fluxoPagamentoPlanoEmpresa({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            let retorno = {};
            yield Database_1.default.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    retorno = yield this.iniciarFluxoPagamentoPlanoEmpresa(request, transaction);
                    transaction.commit();
                    return retorno;
                }
                catch (error) {
                    transaction.rollback();
                    throw error;
                }
            }));
            return retorno;
        });
    }
    iniciarFluxoPagamentoPlanoEmpresa(request, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = yield request.validate(CompanyPaymentValidator_1.default);
            const token = params.token;
            if (token && !(yield this.tokenService.isTokenValido(token))) {
                throw new TokenInvalidoException_1.default();
            }
            const tokenParceiro = yield this.tokenService.findTokenParceiroEmpresa(token);
            const parceiro = tokenParceiro.parceiro;
            const produtoComercial = parceiro.produtoComercial;
            const empresa = yield this.empresaService.buscarEmpresa(params.empresa.cnpj);
            if (empresa.cd_status && empresa.cd_status != 0) {
                throw new EmpresaComPlanoJaCadastrado_1.default();
            }
            const formaPagamento = yield this.formasPagamentoService.findFormaPagamentoEmpresa(produtoComercial.id_prodcomerc);
            if (!formaPagamento) {
                throw new FormaPagamentoNaoEncontrada_1.default();
            }
            let dataPrimeiroVencimento = luxon_1.DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy");
            if (dataPrimeiroVencimento.startOf('day') < luxon_1.DateTime.now().startOf('day')) {
                throw new DataExpiracaoInvalida_1.default();
            }
            let valorMensalidade = parseFloat(formaPagamento.vl_valor);
            let quantidadeVidas = this.calcularQuantidadeVidas(params);
            const categoria = produtoComercial.categoria;
            this.validaQuantidadeVidas(quantidadeVidas, categoria);
            const valorContrato = valorMensalidade * quantidadeVidas;
            yield this.empresaService.saveEmpresa(empresa, params, valorContrato, dataPrimeiroVencimento, tokenParceiro.vendedor.id_vendedor, produtoComercial, transaction);
            yield this.responsavelEmpresaService.deleteResponsavelEmpresaByIdEmpresa(empresa.id_cdempresa, transaction);
            yield this.responsavelEmpresaService.saveResponsavelEmpresa(params, empresa, transaction);
            yield this.funcionarioService.deleteFuncionarioEDependentesByIdEmpresa(empresa.id_cdempresa, transaction);
            yield this.saveFuncionario(params, empresa, produtoComercial, transaction);
            let retunPayment = yield this.fluxoPagamentoBoletoEmpresa.iniciarFluxoPagamento({ empresa, dataPrimeiroVencimento, transaction, nomePlano: produtoComercial.nm_prodcomerc, formaPagamento: FormaPagamento_1.FormaPagamento.BOLETO_EMPRESA });
            return this.criarRetornoPagamento(retunPayment, empresa, quantidadeVidas, valorContrato, produtoComercial.nm_prodcomerc, tokenParceiro.vendedor.tx_nome, dataPrimeiroVencimento);
        });
    }
    criarRetornoPagamento(returnPayment, empresa, quantidadeVidas, valorContrato, nomePlano, nomeVendedor, dataPrimeiroVencimento) {
        return __awaiter(this, void 0, void 0, function* () {
            returnPayment.idEmpresa = empresa.id_cdempresa;
            returnPayment.dataCadastro = empresa.DT_CADASTRO;
            returnPayment.email = empresa.ds_email;
            returnPayment.numeroProposta = empresa.nr_proposta;
            returnPayment.nome = empresa.nm_nome_fantasia;
            returnPayment.quantidadeVidas = quantidadeVidas;
            returnPayment.valorPagamento = (0, FormatNumber_1.default)(valorContrato);
            returnPayment.nomePlano = nomePlano;
            returnPayment.telefone = empresa.nu_dddcel + empresa.nu_celular;
            returnPayment.nomeVendedor = nomeVendedor;
            returnPayment.linkProposta = `https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/2/${empresa.id_cdempresa}`;
            returnPayment.dataVencimento = dataPrimeiroVencimento.toString();
            returnPayment.ddd = empresa.nu_dddcel;
            returnPayment.pagamentoStatus = empresa.cd_status;
            return returnPayment;
        });
    }
    saveFuncionario(params, empresa, produtoComercial, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.funcionarios) {
                for (const funcionario of params.funcionarios) {
                    const funcionarioInserido = yield this.funcionarioService.saveFuncionario(funcionario, empresa, produtoComercial, transaction);
                    if (funcionario.dependentes) {
                        for (const dependente of funcionario.dependentes) {
                            yield this.dependenteFuncionalService.saveDependenteFuncional(empresa, funcionarioInserido, dependente, transaction);
                        }
                    }
                }
            }
        });
    }
    calcularQuantidadeVidas(params) {
        let quantidade = 0;
        params.funcionarios && params.funcionarios.map((funcionario) => __awaiter(this, void 0, void 0, function* () {
            quantidade += 1;
            funcionario.dependentes && funcionario.dependentes.map((_) => __awaiter(this, void 0, void 0, function* () {
                quantidade += 1;
            }));
        }));
        return quantidade;
    }
    validaQuantidadeVidas(numeroVidas, categoria) {
        if (categoria.nu_vidas_min && numeroVidas < categoria.nu_vidas_min) {
            throw new QuantidadeDeVidasAbaixoDoMinimo_1.default();
        }
        if (categoria.nu_vidas_max && numeroVidas > categoria.nu_vidas_max) {
            throw new QuantidadeDeVidasAcimaDoMaximo_1.default();
        }
    }
};
CompanyPaymentController = __decorate([
    (0, fold_1.inject)(),
    __metadata("design:paramtypes", [MailSenderService_1.MailSenderService,
        TokenService_1.default,
        FuncionarioService_1.default,
        EmpresaService_1.default,
        FormasPagamentoService_1.default,
        DependenteFuncionalService_1.default,
        FluxoPagamentoBoletoEmpresa_1.default,
        ResponsavelEmpresaService_1.default])
], CompanyPaymentController);
exports.default = CompanyPaymentController;
//# sourceMappingURL=CompanyPaymentController.js.map
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
const TokenService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/TokenService"));
const AssociadoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/AssociadoService"));
const AssociadoComPlanoJaCadastrado_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/AssociadoComPlanoJaCadastrado"));
const TokenInvalidoException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/TokenInvalidoException"));
const FormaPagamentoNaoEncontrada_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/FormaPagamentoNaoEncontrada"));
const FormasPagamentoService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/FormasPagamentoService"));
const luxon_1 = require("luxon");
const ResponsavelFinanceiroService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/ResponsavelFinanceiroService"));
const DependenteService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/DependenteService"));
const SmsService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/SmsService"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const FluxoPagamentoBoletoIndividual_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Pagamento/FluxoPagamentoBoletoIndividual"));
const FluxoPagamentoCartaoIndividual_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Pagamento/FluxoPagamentoCartaoIndividual"));
const MetodoDePagamentoInvalidoException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/MetodoDePagamentoInvalidoException"));
const TbDependente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbDependente"));
const DataExpiracaoInvalida_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/DataExpiracaoInvalida"));
const FormatNumber_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/FormatNumber"));
const FluxoPagamentoDebitoIndividual_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Fluxo/Pagamento/FluxoPagamentoDebitoIndividual"));
const FormaPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/FormaPagamento");
const GrupoPagamento_1 = global[Symbol.for('ioc.use')]("App/Enums/GrupoPagamento");
const FileService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/FileService"));
const IndividualPaymentValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/IndividualPaymentValidator"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
let IndividualPaymentController = class IndividualPaymentController {
    constructor(tokenService, associadoService, formasPagamentoService, responsavelFinanceiroService, dependenteService, smsService, fluxoPagamentoBoleto, fluxoPagamentoCartao, fluxoPagamentoDebito, fileService) {
        this.tokenService = tokenService;
        this.associadoService = associadoService;
        this.formasPagamentoService = formasPagamentoService;
        this.responsavelFinanceiroService = responsavelFinanceiroService;
        this.dependenteService = dependenteService;
        this.smsService = smsService;
        this.fluxoPagamentoBoleto = fluxoPagamentoBoleto;
        this.fluxoPagamentoCartao = fluxoPagamentoCartao;
        this.fluxoPagamentoDebito = fluxoPagamentoDebito;
        this.fileService = fileService;
        this.linkArquivoIndividualDependente = Env_1.default.get('LINK_ARQUIVO_INDIVIDUAL_DEPENDENTE');
        this.nomeArquivoIndividualDependente = Env_1.default.get('COMPROVANTE_VINCULO_INDIVIDUAL_DEPENDENTE_ARQUIVO');
    }
    index({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            let retorno = {};
            yield Database_1.default.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                try {
                    retorno = yield this.fluxoPagamentoPlano(request, transaction);
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
    fluxoPagamentoPlano(request, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const nomeArquivo = this.nomeArquivoIndividualDependente.replace("idDependente", "123TESTE123".toString());
            const caminhoArquivo = this.linkArquivoIndividualDependente.replace("idAssociado", "123TESTE123".toString());
            const params = yield request.validate(IndividualPaymentValidator_1.default);
            const token = params.token;
            const arquivos = request.allFiles();
            if (token && !(yield this.tokenService.isTokenValido(token))) {
                throw new TokenInvalidoException_1.default();
            }
            const tokenParceiro = yield this.tokenService.findTokenParceiroIndividual(token);
            const parceiro = tokenParceiro.parceiro;
            const produtoComercial = parceiro.produtoComercial;
            const associado = yield this.associadoService.findAssociadoByCpf(params.cpf);
            if (associado.cd_status && associado.cd_status != 0) {
                throw new AssociadoComPlanoJaCadastrado_1.default();
            }
            const formaPagamento = yield this.formasPagamentoService.findFormaPagamentoIndividual(produtoComercial.id_prodcomerc, params.idBanco, params.formaPagamento);
            if (!formaPagamento) {
                throw new FormaPagamentoNaoEncontrada_1.default();
            }
            let dataExpiracao = this.calcularDataExpiracao(params);
            if (dataExpiracao.startOf('day') < luxon_1.DateTime.now().startOf('day')) {
                throw new DataExpiracaoInvalida_1.default();
            }
            let valorMensalidade = this.calculaValorMensalidade(formaPagamento.vl_valor, params.formaPagamento.gpPagto, formaPagamento.nu_PagUnico);
            let quantidadeVidas = this.calculaNumeroVidas(1, params.dependentes == undefined ? 0 : params.dependentes.length);
            const valorContrato = valorMensalidade * quantidadeVidas;
            yield this.associadoService.buildAssociado(associado, params, formaPagamento, valorContrato, dataExpiracao, tokenParceiro.vendedor.id_vendedor, transaction);
            this.responsavelFinanceiroService.deleteResponsavelFinanceiroByIdAssociado(associado.id_associado, transaction);
            const responsavelFinanceiroBanco = yield this.saveResponsavelFinanceiro(params, associado, transaction);
            const dependentes = yield this.saveDependentes(params, associado, transaction);
            const returnPayment = yield this.executaPagamento(params, associado, dataExpiracao, responsavelFinanceiroBanco, transaction, produtoComercial.id_ProdutoS4E_c, produtoComercial.nm_prodcomerc);
            return this.criarRetornoPagamento(returnPayment, params, associado, quantidadeVidas, valorContrato, produtoComercial.nm_prodcomerc, tokenParceiro.vendedor.tx_nome, dataExpiracao);
        });
    }
    salvarArquivos(dependentes, arquivos, associado) {
        return __awaiter(this, void 0, void 0, function* () {
            dependentes.forEach((dependente) => __awaiter(this, void 0, void 0, function* () {
                const key = Object.keys(arquivos).find(key => key.includes(dependente.nu_cpf)) || "";
                const file = arquivos[key];
                if (file) {
                    yield this.fileService.salvarArquivoIndividualDependente(dependente.id_dependente, file, associado.id_associado);
                }
            }));
        });
    }
    executaPagamento(params, associado, dataPrimeiroVencimento, responsavelFinanceiro, transaction, idPlanoS4E, nomePlano) {
        console.log('envio: ', params);
        return __awaiter(this, void 0, void 0, function* () {
            let returnPayment = {};
            if (params.formaPagamento.gpPagto == GrupoPagamento_1.GrupoPagamento.DEBITO_EM_CONTA) {
                returnPayment = yield this.fluxoPagamentoDebito.iniciarFluxoPagamento({ associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, params });
            }
            else if (params.formaPagamento.gpPagto == GrupoPagamento_1.GrupoPagamento.CONSIGNADO) {
                throw new standalone_1.Exception("PAGAMENTO CONSIGNADO NÃO FOI DESENVOLVIDO");
            }
            else if (params.formaPagamento.gpPagto == GrupoPagamento_1.GrupoPagamento.BOLETO) {
                returnPayment = yield this.fluxoPagamentoBoleto.iniciarFluxoPagamento({ associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, formaPagamento: FormaPagamento_1.FormaPagamento.BOLETO, boletoUnico: 0 });
            }
            else if (params.formaPagamento.gpPagto == GrupoPagamento_1.GrupoPagamento.CARTAO_CREDITO) {
                returnPayment = yield this.fluxoPagamentoCartao.iniciarFluxoPagamento({ associado, responsavelFinanceiro, transaction, dataPrimeiroVencimento, nomePlano, idPlanoS4E, params });
            }
            else {
                throw new MetodoDePagamentoInvalidoException_1.default();
            }
            if (associado.cd_status == 0) {
                this.smsService.enviaSmsResponsavelAdesao(responsavelFinanceiro, associado, nomePlano, returnPayment.linkPagamento);
            }
            else {
                this.smsService.enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiro, associado);
            }
            return returnPayment;
        });
    }
    criarRetornoPagamento(returnPayment, params, associado, quantidadeVidas, valorMensalidade, nomePlano, nomeVendedor, dataPrimeiroVencimento) {
        return __awaiter(this, void 0, void 0, function* () {
            returnPayment.idAssociado = associado.id_associado;
            returnPayment.dataCadastro = associado.dt_Cadastro;
            returnPayment.email = associado.ds_email;
            returnPayment.numeroProposta = associado.nr_proposta;
            returnPayment.nome = associado.nm_associado;
            returnPayment.quantidadeVidas = quantidadeVidas;
            returnPayment.valorPagamento = (0, FormatNumber_1.default)(valorMensalidade);
            returnPayment.nomePlano = nomePlano;
            returnPayment.telefone = associado.nu_dddCel + associado.nu_Celular;
            returnPayment.nomeVendedor = nomeVendedor;
            returnPayment.linkProposta = `https://www7.odontogroup.com.br/adminVendas/public/doc_impressao/1/${associado.id_associado}`;
            returnPayment.dataVencimento = dataPrimeiroVencimento.toString();
            returnPayment.ddd = associado.nu_dddCel;
            return returnPayment;
        });
    }
    emailConsignado(params, associado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.chkDocumentoConsignado) {
            }
            else {
            }
        });
    }
    createVendedor(vendedor) {
        const vendedorRetorno = {};
        if (vendedor.tx_nome) {
            vendedorRetorno.nomeCompleto = vendedor.tx_nome;
            vendedorRetorno.nome = vendedor.tx_nome.split(" ");
            vendedorRetorno.PN = vendedorRetorno.nome[0];
            vendedorRetorno.ID = vendedor.id_vendedor;
        }
        else {
            vendedorRetorno.nomeCompleto = "Vendedor Web";
            vendedorRetorno.PN = "OdontoGroup";
            vendedorRetorno.ID = 65083;
        }
        return vendedorRetorno;
    }
    saveDocuments(params, associado) {
        params.docs && params.docs.forEach(doc => {
        });
    }
    saveDependentes(params, associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const dependentes = [];
            if (params.dependentes) {
                yield TbDependente_1.default
                    .query()
                    .where('cd_associado_d', associado.id_associado)
                    .useTransaction(transaction).delete();
                const dependentePromises = params.dependentes.map((depen) => __awaiter(this, void 0, void 0, function* () {
                    const dependente = yield this.dependenteService.saveDependente(depen, associado, transaction);
                    dependentes.push(dependente);
                }));
                yield Promise.all(dependentePromises);
            }
            return dependentes;
        });
    }
    saveResponsavelFinanceiro(params, associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.responsavelFinanceiroService.saveResponsavelFinanceiro(params, associado, transaction);
        });
    }
    calculaValorMensalidade(valorMensalidade, gpPagto, pagamentoUnico) {
        return gpPagto == GrupoPagamento_1.GrupoPagamento.BOLETO && pagamentoUnico ? valorMensalidade * 12 : valorMensalidade;
    }
    calculaNumeroVidas(quantidadeVidas, dependentes) {
        return quantidadeVidas + (dependentes || 0);
    }
    calcularDataExpiracao(params) {
        switch (params.formaPagamento.gpPagto) {
            case GrupoPagamento_1.GrupoPagamento.CARTAO_CREDITO:
                return luxon_1.DateTime.now().plus({ days: 7 });
            case GrupoPagamento_1.GrupoPagamento.DEBITO_EM_CONTA:
                if (params.chkPrimeiraBoleto) {
                    return luxon_1.DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy");
                }
                else {
                    return luxon_1.DateTime.fromFormat(params.vencimentoDebito, "dd/MM/yyyy");
                }
            case GrupoPagamento_1.GrupoPagamento.BOLETO:
                return luxon_1.DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy");
            case GrupoPagamento_1.GrupoPagamento.CONSIGNADO:
                if (params.chkPrimeiraBoleto) {
                    return luxon_1.DateTime.fromFormat(params.vencimentoBoleto, "dd/MM/yyyy");
                }
                else {
                    return luxon_1.DateTime.fromFormat(params.vencimentoConsignado, "dd/MM/yyyy");
                }
            default:
                throw new FormaPagamentoNaoEncontrada_1.default();
        }
    }
};
IndividualPaymentController = __decorate([
    (0, fold_1.inject)(),
    __metadata("design:paramtypes", [TokenService_1.default,
        AssociadoService_1.default,
        FormasPagamentoService_1.default,
        ResponsavelFinanceiroService_1.default,
        DependenteService_1.default,
        SmsService_1.default,
        FluxoPagamentoBoletoIndividual_1.default,
        FluxoPagamentoCartaoIndividual_1.default,
        FluxoPagamentoDebitoIndividual_1.default,
        FileService_1.default])
], IndividualPaymentController);
exports.default = IndividualPaymentController;
//# sourceMappingURL=IndividualPaymentController.js.map
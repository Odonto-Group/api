"use strict";
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
const TbEmpresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbEmpresa"));
const Proposta_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/Proposta"));
const luxon_1 = require("luxon");
class EmpresaService {
    saveEmpresa(empresa, params, valorContrato, dataExpiracao, idVendedor, produtoComercial, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            empresa.cd_codcontratoS4E = produtoComercial.produtoS4E.nu_CodigoAnsS4E;
            empresa.nm_razao_social = params.empresa.razaoSocial;
            empresa.nm_nome_fantasia = params.empresa.nomeFantasia;
            empresa.nu_cnpj = params.empresa.cnpj;
            empresa.nu_inscricao_estadual = params.empresa.inscricalEstadual;
            empresa.nu_qtd_funcionarios = params.empresa.quantidadeFuncionarios;
            empresa.nm_responsavel = params.empresa.nomeResponsavel;
            empresa.nu_cpf_resp = params.empresa.cpfResponsavel;
            empresa.ds_email = params.empresa.email;
            empresa.nu_dddfixo1 = params.empresa.dddFixo;
            empresa.nu_telfixo1 = params.empresa.telefoneFixo;
            empresa.nu_dddcel = params.empresa.dddCelular;
            empresa.nu_celular = params.empresa.celular;
            empresa.DT_CADASTRO = luxon_1.DateTime.now().toString();
            empresa.id_vendedor_e = idVendedor;
            empresa.nu_diavencimento = dataExpiracao.day;
            empresa.id_prodcomerc_e = produtoComercial.id_prodcomerc;
            empresa.dt_dataprimvenc = dataExpiracao.toString();
            empresa.nu_CEP = params.empresa.cep;
            empresa.tx_EndLograd = params.empresa.logradouro;
            empresa.tx_EndNumero = params.empresa.numero;
            empresa.tx_EndCompl = params.empresa.complemento;
            empresa.tx_EndBairro = params.empresa.bairro;
            empresa.tx_EndCidade = params.empresa.cidade;
            empresa.id_UF_e = params.empresa.idUf;
            empresa.cd_status = 0;
            empresa.cd_patrocinio_e = params.empresa.idPatrocinio;
            empresa.nr_proposta = (0, Proposta_1.default)();
            empresa.id_origemVenda = 5;
            empresa.nu_vl_mensalidade = valorContrato;
            yield empresa.useTransaction(transaction).save();
        });
    }
    buscarEmpresa(cnpj) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbEmpresa_1.default.query()
                .where('nu_cnpj', cnpj)
                .first()) || new TbEmpresa_1.default;
        });
    }
}
exports.default = EmpresaService;
//# sourceMappingURL=EmpresaService.js.map
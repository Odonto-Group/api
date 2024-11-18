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
const TbAssociado_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbAssociado"));
const TbOrgaoExpedidor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbOrgaoExpedidor"));
const TbUf_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbUf"));
const Proposta_1 = __importDefault(global[Symbol.for('ioc.use')]("App/utils/Proposta"));
const luxon_1 = require("luxon");
class AssociadoService {
    updateAssociadoPagamentoEfetuado(associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataPagamento = luxon_1.DateTime.now().toString();
            yield TbAssociado_1.default.query()
                .where('id_associado', associado.id_associado)
                .useTransaction(transaction)
                .update({ cd_status: 2, dt_alteraStatus: dataPagamento, dt_inicio_vigencia: dataPagamento });
        });
    }
    ativarPlanoAssociado(associado, transaction, cdStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbAssociado_1.default.query()
                .where("id_associado", associado.id_associado)
                .useTransaction(transaction)
                .update({ cd_status: cdStatus });
        });
    }
    findAssociadoByCpf(cpfAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            const associado = yield TbAssociado_1.default
                .query()
                .preload('responsavelFinanceiro')
                .where("nu_cpf", cpfAssociado)
                .first();
            return associado || new TbAssociado_1.default;
        });
    }
    findAssociadoById(idAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            const associado = yield TbAssociado_1.default
                .query()
                .preload('responsavelFinanceiro')
                .where('id_associado', idAssociado)
                .first();
            return associado || new TbAssociado_1.default;
        });
    }
    findAssociadoByNossoNumeroBoleto(nossoNumero) {
        return __awaiter(this, void 0, void 0, function* () {
            const associado = yield TbAssociado_1.default
                .query()
                .preload('responsavelFinanceiro')
                .innerJoin('tb_pgtoboletoOdontocob', 'tb_pgtoboletoOdontocob.cd_cliente', 'tb_associado.id_associado')
                .where('tb_pgtoboletoOdontocob.nossoNumero', nossoNumero)
                .first();
            return associado || new TbAssociado_1.default;
        });
    }
    buildAssociado(associado, params, formaPagamento, valorContrato, dataExpiracao, idVendedor, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const orgaoExpedidor = yield TbOrgaoExpedidor_1.default.findOrFail(params.idOrgaoExpedidor);
            const uf = yield TbUf_1.default.findOrFail(params.idOrgaoExpedidorUf);
            associado.nm_associado = params.nomeTitular ? params.nomeTitular.toUpperCase() : "";
            associado.nu_cpf = params.cpf ? params.cpf.replace(/\D/g, "") : "";
            associado.nm_mae = params.nomeMae ? params.nomeMae.toUpperCase() : "";
            associado.nu_cns = params.cns;
            associado.nu_rg = params.rg;
            associado.dt_nasc = luxon_1.DateTime.fromFormat(params.dataNascimento, "dd/MM/yyyy").toString();
            associado.ds_email = params.emailTitular ? params.emailTitular.toUpperCase() : "";
            associado.id_sexo_a = params.idSexo;
            associado.id_EstadoCivil_a = params.idEstadoCivil;
            associado.setCelularAttribute(params.celular);
            associado.setOrgaoExpedidor(orgaoExpedidor.sigla, uf.sigla);
            associado.id_FontePag_a = params.idFontePagadora || null;
            associado.id_orgao_a = params.orgao || null;
            associado.cd_perfil = params.perfil || null;
            associado.nu_MatriculaFuncional = params.matricula || null;
            associado.tx_Cargo = params.cargo || null;
            associado.dt_operacao = luxon_1.DateTime.now().toString();
            associado.dt_Cadastro = luxon_1.DateTime.now().toString();
            associado.dt_alteraStatus = luxon_1.DateTime.local().toString();
            associado.id_parentesco_a = 1;
            associado.nu_CEP = params.cep ? params.cep.replace(/\D/g, "") : "";
            associado.tx_EndLograd = params.endereco;
            associado.nu_EndNumero = params.numeroCasa;
            associado.tx_EndCompl = params.complemento || "";
            associado.tx_EndBairro = params.bairro;
            associado.tx_EndCidade = params.cidade;
            associado.id_UF_a = params.idUf;
            associado.id_origemVenda = 5;
            associado.id_vendedor_a = idVendedor;
            associado.cd_CodContratoS4E = formaPagamento.cd_CodContratoS4E;
            associado.dt_dia_vencto = dataExpiracao.day;
            associado.nu_vl_mensalidade = valorContrato;
            associado.id_meiopagto_a = params.formaPagamento.gpPagto;
            associado.dt_dataprimvenc = dataExpiracao.toString();
            associado.dt_inicio_vigencia = luxon_1.DateTime.now().toString();
            associado.cd_status = 0;
            associado.st_mail = 0;
            associado.nr_proposta = (0, Proposta_1.default)();
            associado.id_prodcomerc_a = formaPagamento.produtoComercial.id_prodcomerc;
            yield associado.useTransaction(transaction).save();
        });
    }
}
exports.default = AssociadoService;
//# sourceMappingURL=AssociadoService.js.map
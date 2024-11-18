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
const TbResponsavelFinanceiro_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbResponsavelFinanceiro"));
const luxon_1 = require("luxon");
class ResponsavelFinanceiroService {
    buscarResponsavelFinanceiroPorIdAssociado(id_associado_rf) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield TbResponsavelFinanceiro_1.default
                .query()
                .where('id_associado_rf', id_associado_rf)
                .first()) || new TbResponsavelFinanceiro_1.default;
        });
    }
    deleteResponsavelFinanceiroByIdAssociado(id_associado_rf, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbResponsavelFinanceiro_1.default
                .query()
                .where('id_associado_rf', id_associado_rf)
                .useTransaction(transaction)
                .delete();
        });
    }
    saveResponsavelFinanceiro(params, associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const responsavelFinanceiro = new TbResponsavelFinanceiro_1.default;
            responsavelFinanceiro.id_associado_rf = associado.id_associado;
            responsavelFinanceiro.nu_CPFRespFin = params.responsavelFinanceiro.cpf;
            responsavelFinanceiro.nm_RespFinanc = params.responsavelFinanceiro.nome ? params.responsavelFinanceiro.nome.toUpperCase() : "";
            responsavelFinanceiro.dt_NascRespFin = luxon_1.DateTime.fromFormat(params.responsavelFinanceiro.dataNascimento, "dd/MM/yyyy").toString();
            responsavelFinanceiro.ds_emailRespFin = params.responsavelFinanceiro.email ? params.responsavelFinanceiro.email.toUpperCase() : "";
            responsavelFinanceiro.nu_CEP = params.responsavelFinanceiro.cep ? params.responsavelFinanceiro.cep.replace(/\D/g, "") : "00000000";
            responsavelFinanceiro.tx_EndLograd = params.responsavelFinanceiro.endereco;
            responsavelFinanceiro.tx_EndNumero = params.responsavelFinanceiro.numero;
            responsavelFinanceiro.tx_EndCompl = params.responsavelFinanceiro.complemento || "";
            responsavelFinanceiro.tx_EndBairro = params.responsavelFinanceiro.bairro;
            responsavelFinanceiro.tx_EndCidade = params.responsavelFinanceiro.cidade;
            responsavelFinanceiro.id_uf_rf = params.responsavelFinanceiro.idUf;
            responsavelFinanceiro.setCelularAttribute(params.responsavelFinanceiro.telefone);
            return yield responsavelFinanceiro.useTransaction(transaction).save();
        });
    }
}
exports.default = ResponsavelFinanceiroService;
//# sourceMappingURL=ResponsavelFinanceiroService.js.map
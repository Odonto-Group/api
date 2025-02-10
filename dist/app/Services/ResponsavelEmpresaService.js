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
const TbResponsavelEmpresa_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbResponsavelEmpresa"));
const luxon_1 = require("luxon");
class ResponsavelEmpresaService {
    deleteResponsavelEmpresaByIdEmpresa(idEmpresa, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbResponsavelEmpresa_1.default
                .query()
                .where('id_empresa_rf', idEmpresa)
                .useTransaction(transaction)
                .delete();
        });
    }
    saveResponsavelEmpresa(params, empresa, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const responsavelEmpresa = new TbResponsavelEmpresa_1.default;
            responsavelEmpresa.id_empresa_rf = empresa.id_cdempresa;
            responsavelEmpresa.nu_CPFRespFin = params.responsavelEmpresa.cpf;
            responsavelEmpresa.nm_RespFinanc = params.responsavelEmpresa.nome ? params.responsavelEmpresa.nome.toUpperCase() : "";
            responsavelEmpresa.dt_NascRespFin = luxon_1.DateTime.fromFormat(params.responsavelEmpresa.dataNascimento, "dd/MM/yyyy").toString();
            responsavelEmpresa.ds_emailRespFin = params.responsavelEmpresa.email ? params.responsavelEmpresa.email.toUpperCase() : "";
            responsavelEmpresa.setCelularAttribute(params.responsavelEmpresa.telefone);
            responsavelEmpresa.nr_proposta = empresa.nr_proposta;
            return yield responsavelEmpresa.useTransaction(transaction).save();
        });
    }
}
exports.default = ResponsavelEmpresaService;
//# sourceMappingURL=ResponsavelEmpresaService.js.map
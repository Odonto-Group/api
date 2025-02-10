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
const TbDependente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbDependente"));
const TbOrgaoExpedidor_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbOrgaoExpedidor"));
const TbUf_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbUf"));
const luxon_1 = require("luxon");
class DependenteService {
    saveDependente(novoDependente, associado, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const orgaoExpedidor = yield TbOrgaoExpedidor_1.default.findOrFail(novoDependente.idOrgaoExpedidor);
            const uf = yield TbUf_1.default.findOrFail(novoDependente.idOrgaoExpedidorUf);
            const dependente = new TbDependente_1.default();
            dependente.nm_dependente = novoDependente.nome ? novoDependente.nome.toUpperCase() : "";
            dependente.nu_cpf = novoDependente.cpf;
            dependente.nu_rg = novoDependente.rg;
            dependente.setOrgaoExpedidor(orgaoExpedidor.sigla || "", uf.sigla || "");
            dependente.nu_cns = novoDependente.cns;
            dependente.dt_nasc = luxon_1.DateTime.fromFormat(novoDependente.dataNascimento, "dd/MM/yyyy").toString();
            dependente.nm_mae = novoDependente.nomeMae ? novoDependente.nomeMae.toUpperCase() : "";
            dependente.cd_associado_d = associado.id_associado;
            dependente.id_sexo_d = novoDependente.idSexo || 0;
            dependente.id_parentesco_d = novoDependente.idParentesco || 14;
            dependente.cd_status = 0;
            return yield dependente.useTransaction(transaction).save();
        });
    }
}
exports.default = DependenteService;
//# sourceMappingURL=DependenteService.js.map
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
const TbDependenteFuncional_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbDependenteFuncional"));
const luxon_1 = require("luxon");
class DependenteFuncionalService {
    saveDependenteFuncional(empresa, funcionario, dependenteFuncional, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const dependente = new TbDependenteFuncional_1.default();
            dependente.id_funcionario_df = funcionario.id_funcionario;
            dependente.nm_dependente = dependenteFuncional.nome;
            dependente.nu_cpf = dependenteFuncional.cpf;
            dependente.nu_rg = dependenteFuncional.rg;
            dependente.ds_orgao_expedidor = dependenteFuncional.idOrgaoExpedidor;
            dependente.nu_cns = dependenteFuncional.cns;
            dependente.dt_nasc = luxon_1.DateTime.fromFormat(dependenteFuncional.dataNascimento, "dd/MM/yyyy").toString();
            dependente.nm_mae = dependenteFuncional.nomeMae;
            dependente.id_sexo_df = dependenteFuncional.idSexo;
            dependente.id_parentesco_df = dependenteFuncional.idParentesco;
            dependente.id_prodcomerc_df = empresa.id_prodcomerc_e;
            dependente.vl_valor = empresa.nu_vl_mensalidade;
            dependente.ds_email = dependenteFuncional.email;
            dependente.documento_vinculo = dependenteFuncional.documentoVinculo;
            dependente.useTransaction(transaction).save();
        });
    }
}
exports.default = DependenteFuncionalService;
//# sourceMappingURL=DependenteFuncionalService.js.map
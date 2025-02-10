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
const TbFuncionario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbFuncionario"));
const luxon_1 = require("luxon");
class FuncionarioService {
    saveFuncionario(funcionarioParams, empresa, produtoComercial, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const funcionario = new TbFuncionario_1.default;
            funcionario.id_cdempresa_f = empresa.id_cdempresa;
            funcionario.nm_funcionario = funcionarioParams.nome;
            funcionario.nu_cpf = funcionarioParams.cpf;
            funcionario.nu_cns = funcionarioParams.cns;
            funcionario.nu_rg = funcionarioParams.rg;
            funcionario.ds_orgao_expedidor = funcionarioParams.idOrgaoExpedidor;
            funcionario.dt_nascimento = luxon_1.DateTime.fromFormat(funcionarioParams.dataNascimento || "", "dd/MM/yyyy").toString();
            funcionario.id_sexo_f = funcionarioParams.idSexo;
            funcionario.id_parentesco_f = funcionarioParams.idParentesco;
            funcionario.nm_mae = funcionarioParams.nomeMae;
            funcionario.nu_dddfixo = funcionarioParams.dddFixo;
            funcionario.nu_telefone = funcionarioParams.telefone;
            funcionario.nu_dddcelular = funcionarioParams.dddCelular;
            funcionario.nu_celular = funcionarioParams.celular;
            funcionario.ds_email = funcionarioParams.email;
            funcionario.id_prodcomerc_f = empresa.id_prodcomerc_e;
            funcionario.DT_CADASTRO = luxon_1.DateTime.now().toString();
            funcionario.tipo_plano = 1;
            funcionario.cd_codcontratoS4E = produtoComercial.produtoS4E.nu_CodigoAnsS4E;
            funcionario.nu_matriculafuncional = funcionarioParams.matriculaFuncional;
            funcionario.id_uf_f = funcionarioParams.idUf;
            funcionario.nu_CEP = funcionarioParams.cep;
            funcionario.tx_EndLograd = funcionarioParams.logradouro;
            funcionario.tx_EndNumero = funcionarioParams.numero;
            funcionario.tx_EndCompl = funcionarioParams.complemento;
            funcionario.tx_EndBairro = funcionarioParams.bairro;
            funcionario.tx_EndCidade = funcionarioParams.cidade;
            return yield funcionario.useTransaction(transaction).save();
        });
    }
    deleteFuncionarioEDependentesByIdEmpresa(idEmpresa, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbDependenteFuncional_1.default
                .query()
                .join("tb_funcionario", "id_funcionario_df", "id_funcionario")
                .where("tb_funcionario.id_cdempresa_f", idEmpresa)
                .useTransaction(transaction)
                .delete();
            yield TbFuncionario_1.default
                .query()
                .where("id_cdempresa_f", idEmpresa)
                .useTransaction(transaction).delete();
        });
    }
}
exports.default = FuncionarioService;
//# sourceMappingURL=FuncionarioService.js.map
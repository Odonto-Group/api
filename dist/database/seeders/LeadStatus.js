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
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const TbLeadStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbLeadStatus"));
class default_1 extends Seeder_1.default {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield TbLeadStatus_1.default.createMany([
                {
                    descricao: 'Atendeu',
                },
                {
                    descricao: 'Não Atendeu',
                },
                {
                    descricao: 'Retornar ligação',
                },
                {
                    descricao: 'Dentista Particular',
                },
                {
                    descricao: 'Tratamento recente',
                },
                {
                    descricao: 'SAC',
                },
                {
                    descricao: 'Problemas Financeiros',
                },
                {
                    descricao: 'Efetivado',
                },
                {
                    descricao: 'Aguardando Formalização',
                },
                {
                    descricao: 'Em negociação',
                },
                {
                    descricao: 'Já tem plano',
                },
                {
                    descricao: 'Não tem interesse',
                },
                {
                    descricao: 'Cidade sem cobertura (mencionar a cidade)',
                },
                {
                    descricao: 'Engano',
                },
                {
                    descricao: 'Outros',
                },
                {
                    descricao: 'Telefone inválido',
                },
                {
                    descricao: 'Telefone Ocupado',
                },
                {
                    descricao: 'Caixa Postal',
                },
            ]);
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=LeadStatus.js.map
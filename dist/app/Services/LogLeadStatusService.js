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
const TbLogLeadStatusPrimario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbLogLeadStatusPrimario"));
const TbLogLeadStatusSecundario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbLogLeadStatusSecundario"));
class LogLeadStatusService {
    registerLeadLogStatus(id_lead, status_primario, status_secundario, user_id, mensagem) {
        return __awaiter(this, void 0, void 0, function* () {
            const log_status_primario_result = yield this.registerStatusTable(status_primario, id_lead, user_id, TbLogLeadStatusPrimario_1.default);
            const log_status_secundario_result = yield this.registerStatusTable(status_secundario, id_lead, user_id, TbLogLeadStatusSecundario_1.default, mensagem, log_status_primario_result.id);
            return {
                status_primario: log_status_primario_result,
                status_secundario: log_status_secundario_result
            };
        });
    }
    registerStatusTable(status, id_lead, user_id, table, mensagem = undefined, id_status_primario = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new table();
            const data = {
                user_id: user_id,
                id_lead: id_lead,
            };
            if (mensagem) {
                data['mensagem'] = mensagem;
            }
            if (id_status_primario) {
                data['id_status_primario'] = id_status_primario;
            }
            yield Promise.all(status.map(statusCode => {
                data['id_status'] = statusCode;
                return instance.fill(data).save();
            }));
            return instance;
        });
    }
}
exports.default = LogLeadStatusService;
//# sourceMappingURL=LogLeadStatusService.js.map
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
const TbLeads_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TbLeads"));
class LeadsService {
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const leads = yield TbLeads_1.default.query().preload('statusLeadsSecundario', (query) => {
                query.orderBy('tb_log_leads_status_sec.updated_at', 'desc');
            });
            return leads;
        });
    }
    getPerPage(pageNumber, itemsPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const leads = yield TbLeads_1.default.query().preload('statusLeadsSecundario', (query) => {
                query.groupOrderBy('tb_log_leads_status_sec.updated_at', 'desc').groupLimit(1);
            }).paginate(pageNumber, itemsPerPage);
            return leads;
        });
    }
    getStatusByLead(id_lead) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield TbLeads_1.default.query().where('id_leads', id_lead).preload('statusLeadsPrimario').preload('statusLeadsSecundario');
            return lead;
        });
    }
    registerLead(data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = yield TbLeads_1.default.create(data, { client: trx });
            return lead;
        });
    }
    updateSendStatus(lead) {
        return __awaiter(this, void 0, void 0, function* () {
            lead.enviou = true;
            yield lead.save();
            return lead;
        });
    }
}
exports.default = LeadsService;
//# sourceMappingURL=LeadsService.js.map
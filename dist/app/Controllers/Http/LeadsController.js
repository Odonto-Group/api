"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const fold_1 = require("@adonisjs/fold");
const LeadsService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/LeadsService"));
const LogLeadStatusService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/LogLeadStatusService"));
const StatusLeadService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/StatusLeadService"));
const ApiViaMaisService_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/ApiViaMaisService"));
const LeadUpdateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/LeadUpdateValidator"));
const CreateLeadValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateLeadValidator"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
let LeadsController = class LeadsController {
    constructor(leadsService, logStatusService, statusService, ApiViaMais) {
        this.leadsService = leadsService;
        this.logStatusService = logStatusService;
        this.statusService = statusService;
        this.ApiViaMais = ApiViaMais;
    }
    index({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = request.params().pageNumber;
            const itemsPerPage = request.params().itemsPerPage;
            try {
                const leads = yield this.leadsService.getPerPage(pageNumber, itemsPerPage);
                return leads;
            }
            catch (error) {
                return response.unauthorized(error.message);
            }
        });
    }
    getLeadStatus({ response }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statusService = yield this.statusService.all();
                return statusService;
            }
            catch (error) {
                return response.unauthorized(error.message);
            }
        });
    }
    getOneLeadStatus({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            const lead = request.params().lead;
            try {
                const statusService = yield this.statusService.getByLead(lead);
                return statusService;
            }
            catch (error) {
                return response.unauthorized(error.message);
            }
        });
    }
    store({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield request.validate(CreateLeadValidator_1.default);
            try {
                const successTransaction = yield Database_1.default.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    const lead = yield this.leadsService.registerLead(data, trx);
                    yield this.ApiViaMais.sendLead(data);
                    const leadUpdated = yield this.leadsService.updateSendStatus(lead);
                    return leadUpdated;
                }));
                return successTransaction;
            }
            catch (error) {
                return response.unauthorized(error.message);
            }
        });
    }
    update({ auth, request, response }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield request.validate(LeadUpdateValidator_1.default);
            const lead_id = data.lead;
            const status_primario = data.status_primario;
            const status_secundario = data.status_secundario;
            const mensagem = data.mensagem;
            const user_id = (_a = auth.use('api').user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const status = yield this.logStatusService.registerLeadLogStatus(lead_id, status_primario, status_secundario, user_id, mensagem);
                return status;
            }
            catch (error) {
                return response.unauthorized(error.message);
            }
        });
    }
};
LeadsController = __decorate([
    (0, fold_1.inject)(),
    __metadata("design:paramtypes", [LeadsService_1.default, LogLeadStatusService_1.default, StatusLeadService_1.default, ApiViaMaisService_1.default])
], LeadsController);
exports.default = LeadsController;
//# sourceMappingURL=LeadsController.js.map
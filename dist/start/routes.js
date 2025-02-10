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
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', () => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: 'world' };
}));
Route_1.default.post('/login', 'AuthenticationController.login');
Route_1.default.post('/logout', 'AuthenticationController.logout').middleware('auth:api');
Route_1.default.group(() => {
    Route_1.default.post('/store', 'UserController.store');
    Route_1.default.post('/update', 'UserController.update');
}).prefix('/user').middleware('auth:api');
Route_1.default.group(() => {
    Route_1.default.get('getLeads/:pageNumber/:itemsPerPage', 'LeadsController.index');
    Route_1.default.get('/getOneLeadStatus/:lead', 'LeadsController.getOneLeadStatus');
    Route_1.default.get('/status', 'LeadsController.getLeadStatus');
    Route_1.default.post('/store', 'LeadsController.store');
    Route_1.default.post('/update', 'LeadsController.update');
}).prefix('/leads').middleware('auth:api');
Route_1.default.group(() => {
    Route_1.default.get('/individual/getPlanValue/:state/:token?', 'IndividualPlanController.index');
    Route_1.default.get('/individual/getPlanDetails/:token', 'IndividualPlanController.getPlanDetails');
    Route_1.default.get('/company/getPlanValue/:state/:token?', 'CompanyPlanController.index');
    Route_1.default.get('/company/getPlanDetails/:token', 'CompanyPlanController.getPlanDetails');
}).prefix('/info');
Route_1.default.group(() => {
    Route_1.default.post('/individual/plan', 'IndividualPaymentController.index');
    Route_1.default.post('/company/plan/old', 'CompanyPaymentController.index');
    Route_1.default.post('/company/plan', 'CompanyPaymentController.fluxoPagamentoPlanoEmpresa');
}).prefix('/payment');
Route_1.default.group(() => {
    Route_1.default.post('/boleto', 'WebhookController.index');
    Route_1.default.post('/cartao', 'WebhookController.creditCardPayment');
    Route_1.default.post('/pix', 'WebhookController.pixPayment');
}).prefix('/webhooks/payment');
Route_1.default.group(() => {
    Route_1.default.get('/getAssertivaInfo/:cpf', 'AssertivaController.getAssertivaInfo');
}).prefix('/assertiva');
Route_1.default.group(() => {
    Route_1.default.post('/', 'OuvidoriaController.receiveForm');
}).prefix('/ouvidoria');
//# sourceMappingURL=routes.js.map
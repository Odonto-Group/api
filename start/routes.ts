/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/login', 'AuthenticationController.login')
Route.post('/logout', 'AuthenticationController.logout').middleware('auth:api')

Route.group(() => {
  Route.post('/store', 'UserController.store')
  Route.post('/update', 'UserController.update')
}).prefix('/user').middleware('auth:api')

Route.group(() => {
  Route.get('getLeads/:pageNumber/:itemsPerPage', 'LeadsController.index')
  Route.get('/getOneLeadStatus/:lead', 'LeadsController.getOneLeadStatus')
  Route.get('/status', 'LeadsController.getLeadStatus')
  Route.post('/store', 'LeadsController.store')
  Route.post('/update', 'LeadsController.update') 	
}).prefix('/leads').middleware('auth:api')

Route.group(() => {
  Route.get('/individual/getPlanValue/:state/:token?', 'IndividualPlanController.index')
  Route.get('/individual/getPlanDetails/:token', 'IndividualPlanController.getPlanDetails')
  Route.get('/servidor/getPlanDetails/:token', 'ServerPlanController.getPlanDetails')
  Route.get('/dependente/getPlansSeller', 'ServerPlanController.getPlanGdfInfo')
  Route.get('/company/getPlanValue/:state/:token?', 'CompanyPlanController.index')
  Route.get('/getPlansSeller', 'IndividualPlanController.getPlansBySeller')
  Route.get('/company/getPlanDetails/:token', 'CompanyPlanController.getPlanDetails')
  Route.get('/orgao','OrgaoController.getOrgaoInfo')
  Route.get('/orgaoId','OrgaoController.getOrgaobyId')
  Route.get('/orgaoFP','OrgaoController.getOrgaobyFP')
  Route.get('/enderecoId','enderecosIdController.getEnderecoInfo')
  Route.get('/AssociadoServidor','GDFAssertivaController.getDadosAssociado')
}).prefix('/info')

Route.group(() => {
  Route.post('/individual/plan', 'IndividualPaymentController.index')
  Route.post('/company/plan/old', 'CompanyPaymentController.index')
  Route.post('/company/plan', 'CompanyPaymentController.fluxoPagamentoPlanoEmpresa')
}).prefix('/payment')

Route.group(() => {
  Route.post('/servidor/dependent', 'DependentController.index')
  Route.get('/servidor', 'AssociadoController.index')
}).prefix('/include')

Route.group(() => {
  Route.post('/boleto', 'WebhookController.index')
  Route.post('/cartao', 'WebhookController.creditCardPayment')
  Route.post('/pix', 'WebhookController.pixPayment')
}).prefix('/webhooks/payment');

Route.group(() => {
  Route.get('/getAssertivaInfo/:cpf', 'AssertivaController.getAssertivaInfo')
}).prefix('/assertiva');

Route.group(() => {
  Route.post('/', 'OuvidoriaController.receiveForm');
}).prefix('/ouvidoria');
Route.group(() => {
  Route.get('/mailGdf', 'SendMailController.sendMailGdfTest');
  Route.get('/mailUser', 'SendMailController.sendMailUser');
  Route.get('/mailAllUsers', 'SendMailController.sendMailAllUsers');
  Route.get('/ErrorMail', 'SendMailController.ErrorMail');
  Route.post('/createCarencia', 'CarenciaController.testeCarencia');
}).prefix('/test');

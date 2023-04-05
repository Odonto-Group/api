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

import Route from '@ioc:Adonis/Core/Route'

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
  Route.post('/update', 'LeadsController.update')
}).prefix('/leads').middleware('auth:api')

Route.post('leads/store', 'LeadsController.store');






import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserService from 'App/Services/UserAdminService';
import { inject } from '@adonisjs/fold'
import CreateUserValidator from 'App/Validators/CreateUserValidator';

@inject()
export default class UserController {

  private userService: UserService;

  constructor(userService: UserService) {
      this.userService = userService
  }

  async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)
    
    try {
      const user = await this.userService.store(data)
      return user
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }

  async update({ request, response }: HttpContextContract) {
    const data = request.all();
    try {
      const user = await this.userService.update(data)
      return user
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }
}

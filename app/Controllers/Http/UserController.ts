import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserService from 'App/Services/UserService';
import User from 'App/Models/User';
import { inject } from '@adonisjs/fold'

@inject()
export default class UserController {

  private userService: UserService;

  constructor(userService: UserService) {
      this.userService = userService
  }

  async store({ request, response }: HttpContextContract) {
    const data = request.only(['cpf', 'name', 'email', 'password', 'rememberMeToken']);
    
    try {
      const user = await this.userService.store(data)
      return user
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AuthenticationService from 'App/Services/AuthenticationService'
import { inject } from '@adonisjs/fold'

@inject()
export default class AuthenticationController {

    private authenticationService: AuthenticationService;
 
    constructor(authenticationService: AuthenticationService) {
        this.authenticationService = authenticationService
    }

    async login({ request, response, auth }: HttpContextContract) {
    const cpf = request.input('cpf')
    const password = request.input('password')

    try {
      const token = await this.authenticationService.login(auth, cpf, password)
      return token
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }

  async logout({ response, auth }: HttpContextContract) {
    await this.authenticationService.logout(auth)
    return response.ok({ revoked: true })
  }
}

    
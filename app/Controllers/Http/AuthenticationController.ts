import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/core/build/standalone'

import AuthenticationService from 'App/Services/AuthenticationService'

export default class AuthenticationController {

    private authenticationService: AuthenticationService;
    static get inject() {
        return ['App/Services/AuthenticationService']
    }
    
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

  async logout({ response }: HttpContextContract) {
    await this.authenticationService.logout()
    return response.ok({ revoked: true })
  }
}

    
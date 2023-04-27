
import UserAdmin from 'App/Models/UserAdmin'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
const bcrypt = require('bcrypt')

export default class AuthenticationService {
    async login( auth: AuthContract, cpf: string, password: string ): Promise<any> {
      const user = await UserAdmin.query().where('cpf', cpf).firstOrFail()

      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials')
      }

      const token = await auth.use('api').generate(user, {
        expiresIn: '1 day'
      })  
      
      return token
    }
  
    async logout( auth:AuthContract ):Promise<any> {
      await auth.use('api').revoke()
      return {
        revoked: true
      }
    }
  }
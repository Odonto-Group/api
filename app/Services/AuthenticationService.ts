
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class AuthenticationService {
    async login(auth: AuthContract, cpf: string, password: string): Promise<any> {
      const user = await User.query().where('cpf', cpf).firstOrFail()
  
      if (!(await Hash.verify(user.password, password))) {
        throw new Error('Invalid credentials')
      }
  
      const token = await auth.use('api').generate(user, {
        expiresIn: '30 mins'
      })
  
      return token
    }
  
    async logout():Promise<any> {
      await auth.use('api').revoke()
      return {
        revoked: true
      }
    }
  }
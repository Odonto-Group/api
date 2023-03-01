
import User from 'App/Models/User'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class UserService {
  async store( data: Object ): Promise<any> {

    const { cpf, name, email, password, rememberMeToken } = data;
      
    const user = await User.create({
        cpf,
        name,
        email,
        password,
        rememberMeToken
    })
      
    return user
  }
  
}
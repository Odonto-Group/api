
import User from 'App/Models/User'

export default class UserService {
  async store( data: Object ): Promise<any> {

    const user = await User.create(data);
    return user
  }

  async update( data: Object ): Promise<any> {
    const user = await User.findOrFail(data.id)
    user.name = data.name,
    user.email = data.email,
    user.password = data.password,
    await user.save() 
    return user;
  }
  
}
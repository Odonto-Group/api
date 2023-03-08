
import User from 'App/Models/User'

export default class UserService {
  async store( data: Object ): Promise<any> {

    const user = await User.create(data);
    return user
  }
  
}
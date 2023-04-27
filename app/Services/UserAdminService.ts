
import UserAdmin from 'App/Models/UserAdmin'

export default class UserAdminService {
  async store( data: Object ): Promise<any> {

    const user = await UserAdmin.create(data);
    return user
  }

  async update( data: Record<string, any> ): Promise<any> {
    const userAdmin = await UserAdmin.findOrFail(data.id)
    userAdmin.name = data.name,
    userAdmin.email = data.email,
    userAdmin.password = data.password,
    await userAdmin.save() 
    return userAdmin;
  }
  
}
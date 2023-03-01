import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {

    await User.create({
      email: 'jadyel@adonisjs.com',
      name: 'jadyel',
      password: '123456',
      cpf: '42892497019',
    })
  }
}
import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
const bcrypt = require('bcrypt')

export default class UserAdmin extends BaseModel {
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public cpf: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: UserAdmin) {
    if (user.$dirty.password) {

      user.password = await bcrypt.hash(user.password, 10)
    }
  }
}

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbSexo extends BaseModel {
  public static table = 'tb_sexo'

  @column({ isPrimary: true })
  public id_sexo: number

  @column()
  public nm_sexo: string

  @column()
  public cd_sexoS4E: number
}
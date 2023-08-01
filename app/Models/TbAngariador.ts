import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbAngariador extends BaseModel {
  public static table = 'tb_angariador'

  @column({ isPrimary: true })
  public cd_matricula: string

  @column()
  public nm_angariador: string
}
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbEstadoCivil extends BaseModel {
  public static table = 'tb_estadocivil'

  @column({ isPrimary: true })
  public id_EstadoCivil: number

  @column()
  public nm_EstadoCivil: string
}

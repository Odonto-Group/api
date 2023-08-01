import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbEstadoCivil extends BaseModel {
  public static table = 'tb_estadocivil'

  @column({ isPrimary: true , columnName: 'id_EstadoCivil'})
  public id_EstadoCivil: number

  @column({columnName: 'nm_EstadoCivil'})
  public nm_EstadoCivil: string
}
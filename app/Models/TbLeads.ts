import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class TbLeads extends BaseModel {
  public static table = 'tb_leads'
  public static primaryKey = 'id_leads'

  @column({ isPrimary: true, })
  public id_leads: number

  @column()
  public nome: string

  @column()
  public email: string

  @column()
  public telefone: string

  @column()
  public origem: string

  @column.dateTime()
  public data: DateTime

  @column()
  public enviou: number
}

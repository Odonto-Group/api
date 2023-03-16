import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbLogLeadStatusSecundario extends BaseModel {

  public static table = 'tb_log_leads_status_sec'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public id_lead: number

  @column()
  public id_status: number

  @column()
  public mensagem: string

  @column()
  public id_status_primario: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

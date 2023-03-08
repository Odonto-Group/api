import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbLogLeadStatus extends BaseModel {

  public static table = 'tb_log_leads_status'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

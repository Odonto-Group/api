import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbLogLeadStatusPrimario extends BaseModel {

  public static table = 'tb_log_leads_status_prim'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public id_lead: number

  @column()
  public id_status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

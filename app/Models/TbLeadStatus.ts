import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import TbLeads from './TbLeads'

export default class StatusLeads extends BaseModel {

  public static table = 'tb_leads_status'

  @column({ isPrimary: true })
  public id: number

  @column()
  public descricao: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => TbLeads, {
    localKey: 'id',
    relatedKey: 'id_leads',
    pivotTable: 'tb_log_leads_status_sec',
    pivotForeignKey: 'id_status',
    pivotRelatedForeignKey: 'id_lead',
  })

  public leads: ManyToMany<typeof TbLeads>
}

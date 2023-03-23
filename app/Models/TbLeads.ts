import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import StatusLeads from './TbLeadStatus'

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
  public enviou: boolean

  @column.date()
  public data_nascimento: DateTime

  @column()
  public cpf: string

  @column()
  public cep: string

  @manyToMany(() => StatusLeads, {
    localKey: 'id_leads',
    relatedKey: 'id',
    pivotTable: 'tb_log_leads_status_sec',
    pivotForeignKey: 'id_lead',
    pivotRelatedForeignKey: 'id_status',
  })

  public statusLeadsSecundario: ManyToMany<typeof StatusLeads>

  @manyToMany(() => StatusLeads, {
    localKey: 'id_leads',
    relatedKey: 'id',
    pivotTable: 'tb_log_leads_status_prim',
    pivotForeignKey: 'id_lead',
    pivotRelatedForeignKey: 'id_status',
  })

  public statusLeadsPrimario: ManyToMany<typeof StatusLeads>
}

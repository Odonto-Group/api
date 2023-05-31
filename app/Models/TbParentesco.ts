import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbParentesco extends BaseModel {
  public static table = 'tb_parentesco'

  @column({ isPrimary: true })
  public id_parentesco: number

  @column()
  public cd_parentesco: number

  @column()
  public nm_grau_parentesco: string

  @column()
  public nm_siglagraupar: string

  @column()
  public nu_status: number

  @column({columnName: 'nu_UsoTipoPlan'})
  public nu_UsoTipoPlan: number
}

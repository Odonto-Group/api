import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbOrgaoExpedidor extends BaseModel {
   public static table = 'tb_orgaoExpedidor'

  @column({ isPrimary: true })
  public id_oe: number

  @column()
  public nm_orgaoexpedidor: string | null

  @column()
  public sigla: string | null
}

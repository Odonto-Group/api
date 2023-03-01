import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class TbLeads extends BaseModel {
  public static table = 'tb_leads'
  public static primaryKey = 'id_leads'

  @column({ isPrimary: true })
  public id: number

  
  
}

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbOrgao extends BaseModel {
  public static table = 'tb_orgao'

  @column({ isPrimary: true })
  public id_orgao: number

  @column({columnName: 'id_Fontepag_o'})
  public id_Fontepag_o: number | null

  @column({columnName: 'nu_CodOrgao'})
  public nu_CodOrgao: number | null

  @column({columnName: 'tx_NmFontePagOrgao'})
  public tx_NmFontePagOrgao: string | null

  @column({columnName: 'tx_NmOrgao'})
  public tx_NmOrgao: string | null
}
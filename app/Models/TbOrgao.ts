import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbOrgao extends BaseModel {
  public static table = 'tb_orgao'

  @column({ isPrimary: true })
  public id_orgao: number

  @column()
  public id_Fontepag_o: number | null

  @column()
  public nu_CodOrgao: number | null

  @column()
  public tx_NmFontePagOrgao: string | null

  @column()
  public tx_NmOrgao: string | null
}
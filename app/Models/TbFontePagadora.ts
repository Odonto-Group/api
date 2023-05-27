import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbFontePagadora extends BaseModel {
  public static table = 'tb_FontePag'

  @column({ isPrimary: true })
  public id_Fontepag: number

  @column()
  public tx_NmFontePag: string | null

  @column()
  public st_ativo: number | null

  @column()
  public id_PerfilServidorfp: number | null
}

import { BaseModel, column, belongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class TbModProduto extends BaseModel {
  public static table = 'tb_ModProduto'

  @column({ isPrimary: true })
  public id: number

  @column()
  public tx_nome: string
}
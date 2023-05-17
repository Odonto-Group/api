import { BaseModel, column, belongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class TbModProduto extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public tx_nome: string
}
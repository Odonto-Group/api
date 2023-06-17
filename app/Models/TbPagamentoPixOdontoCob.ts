import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoPixOdontocob extends BaseModel {
  public static table = 'tb_pgtopixOdontocob'

  @column({ isPrimary: true })
  public id: number

  @column()
  public cdAssociado: number

  @column()
  public idPixOdontocob: string

  @column()
  public dtCadastro: string

  @column()
  public dtPagamento: string

  @column()
  public valorPago: number

  @column()
  public updatedAt: string
}

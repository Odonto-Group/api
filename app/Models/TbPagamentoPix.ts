import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoPix extends BaseModel {
  public static tableName = 'tb_pgtopix'

  @column({ isPrimary: true })
  public id: number

  @column()
  public cdAssociado: number

  @column()
  public idPixOdontocob: string

  @column()
  public dtCadastro: string

  @column()
  public dtVencimento: string

  @column()
  public valor: number

  @column()
  public dtPagamento: string

  @column()
  public copiaCola: string

  @column()
  public qrCode: string

  @column()
  public ativo: boolean

  @column()
  public updatedAt: string
}
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoPix extends BaseModel {
  public static tableName = 'tb_pgtoPix'

  @column({ isPrimary: true })
  public id: number

  @column({columnName: "cdAssociado"})
  public cdAssociado: number

  @column({columnName: "idPixOdontocob"})
  public idPixOdontocob: string

  @column({columnName: "dtCadastro"})
  public dtCadastro: string

  @column({columnName: "dtVencimento"})
  public dtVencimento: string

  @column()
  public valor: number

  @column({columnName: "dtPagamento"})
  public dtPagamento: string

  @column()
  public ativo: boolean

  @column()
  public updatedAt: string
}
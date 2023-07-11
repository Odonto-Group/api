import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoPix extends BaseModel {
  public static table = 'tb_pgtopix'

  @column({ isPrimary: true })
  public id: number

  @column({columnName: "cd_associado"})
  public cd_associado: number

  @column({columnName: "id_pix_odontocob"})
  public id_pix_odontocob: string

  @column({columnName: "dt_cadastro"})
  public dt_cadastro: string

  @column({columnName: "dt_vencimento"})
  public dt_vencimento: string

  @column()
  public valor: number

  @column({columnName: "dt_pagamento"})
  public dt_pagamento: string

  @column()
  public ativo: boolean

  @column({columnName: "updated_at"})
  public updated_at: string
}
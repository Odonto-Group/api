import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoPixOdontocob extends BaseModel {
  public static table = 'tb_pgtopixOdontocob'

  @column({ isPrimary: true })
  public id: number

  @column({columnName: "cd_associado"})
  public cd_associado: number

  @column({columnName: "cd_empresa"})
  public cd_empresa: number

  @column({columnName: "id_pix_odontocob"})
  public id_pix_odontocob: string

  @column({columnName: "dt_cadastro"})
  public dt_cadastro: string

  @column({columnName: "dt_pagamento"})
  public dt_pagamento: string

  @column({columnName: "valor_pago"})
  public valor_pago: number

  @column({columnName: "updated_at"})
  public updated_at: string

  @column({columnName: "created_at"})
  public created_at: string
}
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PagamentoBoleto extends BaseModel {
  public static table = 'tb_pgtoboleto';

  @column({ isPrimary: true })
  public id_pagtoboleto: number

  @column()
  public cd_associado_pb: number

  @column()
  public id_banco_pb: number

  @column()
  public nu_nossonum: string

  @column()
  public nu_IdBolSimples: string

  @column()
  public nu_valoremissao: number

  @column()
  public dt_vencimento: string

  @column()
  public dt_emissao: string

  @column()
  public dt_pagamento: string

  @column()
  public vl_valorpago: number

  @column()
  public tx_linkboletosimples: string

  @column()
  public nu_statusboleto: number

  @column()
  public nu_unico: number
}
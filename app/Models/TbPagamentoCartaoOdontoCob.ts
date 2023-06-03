import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoCartaoOdontoCob extends BaseModel {
  public static table = 'tb_pgtocartaoOdontocob';

  @column({ isPrimary: true })
  public id_pgtocartao_odonto: number

  @column()
  public cd_associado_pco: number

  @column()
  public tx_token: string

  @column()
  public vl_valor: number

  @column()
  public dt_cadastro: string

  @column()
  public dt_vencimento: string

  @column()
  public nr_proposta: string

  @column()
  public dt_pagamento: string

  @column()
  public pagamento_id: string

  @column()
  public nsu: string

  @column()
  public autorizacao_codigo: string

  @column()
  public cartao_id: string

  @column()
  public bl_ativo: boolean

  @column()
  public link_pgto: string
}
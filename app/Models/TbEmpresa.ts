import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class TbEmpresa extends BaseModel {
  public static table = 'tb_empresa'

  @column({ isPrimary: true })
  public id_cdempresa: number

  @column()
  public cd_codcontratoS4E: number

  @column()
  public nm_razao_social: string

  @column()
  public nm_nome_fantasia: string

  @column()
  public nu_cnpj: string

  @column()
  public nu_inscricao_estadual: string

  @column()
  public nu_qtd_funcionarios: number

  @column()
  public nm_responsavel: string

  @column()
  public nu_cpf_resp: string

  @column()
  public ds_email: string

  @column()
  public nu_dddfixo1: string

  @column()
  public nu_telfixo1: string

  @column()
  public nu_dddfixo2: string

  @column()
  public nu_telfixo2: string

  @column()
  public nu_dddcel: string

  @column()
  public nu_celular: string

  @column.dateTime({ autoCreate: true })
  public DT_CADASTRO: DateTime

  @column()
  public id_vendedor_e: number

  @column()
  public nu_diavencimento: number

  @column()
  public id_prodcomerc_e: number

  @column.dateTime()
  public dt_dataprimvenc: DateTime

  @column()
  public nu_CEP: string

  @column()
  public tx_EndLograd: string

  @column()
  public tx_EndNumero: string

  @column()
  public tx_EndCompl: string

  @column()
  public tx_EndBairro: string

  @column()
  public tx_EndCidade: string

  @column()
  public id_UF_e: number

  @column()
  public tx_nmarqimport: string

  @column()
  public cd_status: number

  @column()
  public cd_patrocinio_e: number

  @column()
  public nr_proposta: string

  @column()
  public id_origemVenda: number

  @column.date()
  public dt_alteraStatus: DateTime

  @column()
  public nu_vl_mensalidade: number
}
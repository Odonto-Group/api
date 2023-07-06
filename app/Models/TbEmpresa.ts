import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercial from './TbProdutoComercial'

export default class TbEmpresa extends BaseModel {
  public static table = 'tb_empresa'

  @column({ isPrimary: true })
  public id_cdempresa: number

  @column({ columnName: "cd_codcontratoS4E" })
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

  @column({ columnName: "DT_CADASTRO" })
  public DT_CADASTRO: string

  @column()
  public id_vendedor_e: number

  @column()
  public nu_diavencimento: number

  @column()
  public id_prodcomerc_e: number

  @column()
  public dt_dataprimvenc: string

  @column({ columnName: "nu_CEP"})
  public nu_CEP: string

  @column({ columnName: "tx_EndLograd"})
  public tx_EndLograd: string

  @column({ columnName: "tx_EndNumero"})
  public tx_EndNumero: string

  @column({ columnName: "tx_EndCompl"})
  public tx_EndCompl: string

  @column({ columnName: "tx_EndBairro"})
  public tx_EndBairro: string

  @column({ columnName: "tx_EndCidade"})
  public tx_EndCidade: string

  @column({ columnName: "id_UF_e"})
  public id_UF_e: number

  @column()
  public tx_nmarqimport: string

  @column()
  public cd_status: number

  @column()
  public cd_patrocinio_e: number

  @column()
  public nr_proposta: string

  @column({ columnName: "id_origemVenda"})
  public id_origemVenda: number

  @column()
  public dt_alteraStatus: string

  @column()
  public nu_vl_mensalidade: number

  @belongsTo(() => TbProdutoComercial, {
    foreignKey: "id_prodcomerc_e"
  })
  public produtoComercial: BelongsTo<typeof TbProdutoComercial>
}
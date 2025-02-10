import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPagamentoConsignado extends BaseModel {
  public static table = 'tb_pgtoconsig';

  @column({ isPrimary: true })
  public id_pgtoconsig: number

  @column()
  public cd_associado_con: number

  @column()
  public id_perfil_con: number

  @column()
  public id_Fontepag_con: number

  @column()
  public id_orgao_con: number

  @column()
  public cd_vincservpub_con: number

  @column()
  public tx_desc_cargo: string

  @column()
  public tx_matric_serv: string

  @column()
  public nu_valor: number

  @column()
  public dt_vencimento: string

  @column()
  public cd_tokenGdf: string
}
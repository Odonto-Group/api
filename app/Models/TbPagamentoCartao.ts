import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class TbPagamentoCartao extends BaseModel {
  public static table = 'tb_pgtocartao';

  @column({ isPrimary: true })
  public id_pgtocartao: number

  @column()
  public cd_associado_pc: number

  @column()
  public tid: string

  @column()
  public dt_cadastro: Date

  @column()
  public mensagem: string

  @column()
  public bandeira: string

  @column()
  public parcela: number

  @column()
  public nu_numcartao: string

  @column()
  public cod_autorizacao: string

  @column()
  public nu_mesvalidade: string

  @column()
  public nu_anovalidade: string

  @column()
  public vl_valor: number

  @column()
  public nu_cvv: string

  @column()
  public nu_stattransacao: number

  @column()
  public codigoRetorno: string
}
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbResponsavelFinanceiro extends BaseModel {
  public static table = 'tb_RespFinanc' 

  @column({ isPrimary: true })
  public id_respfinanc: number

  @column()
  public id_associado_rf: number

  @column()
  public nu_CPFRespFin: string

  @column()
  public nm_RespFinanc: string

  @column()
  public dt_NascRespFin: Date

  @column()
  public ds_emailRespFin: string

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
  public id_uf_rf: number

  @column()
  public nu_dddRespFin: number

  @column()
  public nu_telRespFin: number

  setCelularAttribute(value: string){
      this.nu_dddRespFin = parseInt(value.substring(0, 2));
      this.nu_telRespFin = parseInt(value.substring( 2, 10));
  }
}
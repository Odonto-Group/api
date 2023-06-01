import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbResponsavelFinanceiro extends BaseModel {
  public static table = 'tb_RespFinanc' 

  @column({ isPrimary: true })
  public id_respfinanc: number

  @column()
  public id_associado_rf: number

  @column({columnName: "nu_CPFRespFin"})
  public nu_CPFRespFin: string

  @column({columnName: "nm_RespFinanc"})
  public nm_RespFinanc: string

  @column({columnName: "dt_NascRespFin"})
  public dt_NascRespFin: Date

  @column({columnName: "ds_emailRespFin"})
  public ds_emailRespFin: string

  @column({columnName: "nu_CEP"})
  public nu_CEP: string

  @column({columnName: "tx_EndLograd"})
  public tx_EndLograd: string

  @column({columnName: "tx_EndNumero"})
  public tx_EndNumero: string

  @column({columnName: "tx_EndCompl"})
  public tx_EndCompl: string

  @column({columnName: "tx_EndBairro"})
  public tx_EndBairro: string

  @column({columnName: "tx_EndCidade"})
  public tx_EndCidade: string

  @column()
  public id_uf_rf: number

  @column({columnName: "nu_dddRespFin"})
  public nu_dddRespFin: number

  @column({columnName: "nu_telRespFin"})
  public nu_telRespFin: number

  setCelularAttribute(value: string){
      this.nu_dddRespFin = parseInt(value.substring(0, 2));
      this.nu_telRespFin = parseInt(value.substring( 2, 10));
  }
}
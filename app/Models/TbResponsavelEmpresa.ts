import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbRespFinanceiro extends BaseModel {
  public static table = 'tb_RespEmpresa'

  @column({ columnName: 'id_respfinanc' })
  public id_respfinanc: number

  @column({ columnName: 'id_empresa_rf' })
  public id_empresa_rf: number

  @column({ columnName: 'nu_CPFRespFin' })
  public nu_CPFRespFin: string

  @column({ columnName: 'nm_RespFinanc' })
  public nm_RespFinanc: string

  @column({ columnName: 'dt_NascRespFin' })
  public dt_NascRespFin: string

  @column({ columnName: 'nu_dddRespFin' })
  public nu_dddRespFin: string

  @column({ columnName: 'nu_telRespFin' })
  public nu_telRespFin: string

  @column({ columnName: 'nu_dddCelRespFin' })
  public nu_dddCelRespFin: string

  @column({ columnName: 'nu_celRespFin' })
  public nu_celRespFin: string

  @column({ columnName: 'nr_proposta' })
  public nr_proposta: string

  @column({ columnName: 'ds_emailRespFin' })
  public ds_emailRespFin: string

  setCelularAttribute(value: string){
    value = value ? value.replace(/\D/g, "") : "00000000000"
    this.nu_dddCelRespFin = value.substring(0, 2);
    this.nu_celRespFin = value.substring( 2, 10);
  }
}

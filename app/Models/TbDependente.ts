import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Dependente extends BaseModel {
  public static table = 'tb_dependente'

  @column({ isPrimary: true })
  public id_dependente: number

  @column()
  public nm_dependente: string

  @column()
  public nu_cpf: string

  @column()
  public nu_rg: string

  @column()
  public ds_orgao_expedidor: string

  @column()
  public nu_cns: string

  @column()
  public dt_nasc: string

  @column()
  public nm_mae: string

  @column()
  public cd_associado_d: number

  @column()
  public id_sexo_d: number

  @column()
  public id_parentesco_d: number

  @column()
  public cd_status: number

  @column()
  public nu_vl_mensalidade: number

  setOrgaoExpedidor(orgaoExpedidor: string, uf: string){
      this.ds_orgao_expedidor = orgaoExpedidor + '-' + uf;
  }
}

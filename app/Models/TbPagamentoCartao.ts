import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class TbPagamentoCartao extends BaseModel {
  public static table = 'tb_pgtocartao';

  @column({ isPrimary: true })
  public id_pgtocartao: number

  @column({columnName: "cd_associado_pc"})
  public cd_associado_pc: number

  @column({columnName: "tid"})
  public tid: string

  @column({columnName: "dt_cadastro"})
  public dt_cadastro: string

  @column({columnName: "mensagem"})
  public mensagem: string

  @column({columnName: "bandeira"})
  public bandeira: string

  @column({columnName: "parcela"})
  public parcela: number

  @column({columnName: "nu_numcartao"})
  public nu_numcartao: string

  @column({columnName: "cod_autorizacao"})
  public cod_autorizacao: string

  @column({columnName: "nu_mesvalidade"})
  public nu_mesvalidade: string

  @column({columnName: "nu_anovalidade"})
  public nu_anovalidade: string

  @column({columnName: "vl_valor"})
  public vl_valor: number

  @column({columnName: "nu_cvv"})
  public nu_cvv: string

  @column({columnName: "nu_stattransacao"})
  public nu_stattransacao: number

  @column({columnName: "codigoRetorno"})
  public codigoRetorno: string
}
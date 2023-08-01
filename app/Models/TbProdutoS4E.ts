import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercial from './TbProdutoComercial'

export default class TbProdutoS4E extends BaseModel {
  public static table = 'tb_ProdAnsS4E'

  @column({ columnName: 'id_ProdutoS4E', isPrimary: true })
  public cd_codigo: number

  @column({ columnName: 'id_AbrangAnsS4E_p' })
  public id_AbrangAnsS4E_p: number

  @column({ columnName: 'nu_CodProdutoS4E' })
  public nu_CodProdutoS4E: number

  @column({ columnName: 'nm_NomeProdS4E' })
  public nm_NomeProdS4E: string

  @column({ columnName: 'nu_CodigoAnsS4E' })
  public nu_CodigoAnsS4E: number

  @column({ columnName: 'nu_CodClassAnsS4E' })
  public nu_CodClassAnsS4E: string

  @column({ columnName: 'nm_NomeProdANS' })
  public nm_NomeProdANS: string

  @column({ columnName: 'nu_CodClassTpEmp' })
  public nu_CodClassTpEmp: number

  @column({ columnName: 'nm_DscClassTpEmp' })
  public nm_DscClassTpEmp: string

  @column({ columnName: 'tx_UFsAbrangencia' })
  public tx_UFsAbrangencia: string

  @hasMany(() => TbProdutoComercial)
  public produtoComercial:  HasMany<typeof TbProdutoComercial>
}
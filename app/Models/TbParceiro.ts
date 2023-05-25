import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercialParceiro from './TbProdutoComercialParceiro'
import TbTokenIdParc from './TbTokenIdParc'

export default class TbParceiro extends BaseModel {
  public static table = 'tb_parceiro'

  @column({ isPrimary: true })
  public id_parceiro: number

  @hasMany(() => TbProdutoComercialParceiro, {
    foreignKey: 'id_prodcomerc',
  })
  public produtoComercialParceiro: HasMany<typeof TbProdutoComercialParceiro>

  @hasMany(() => TbTokenIdParc, {
    foreignKey: 'nu_IdParceiro_tk'
  })
  public tokenidparc: HasMany<typeof TbTokenIdParc>
}
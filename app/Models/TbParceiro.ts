import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercial from './TbProdutoComercialParceiro'
import TbTokenIdParc from './TbTokenIdParc'

export default class TbParceiro extends BaseModel {
  public static table = 'tb_parceiro'

  @column({ isPrimary: true })
  public id_parceiro: number

  @column()
  public id_prodcomerc_pr: number

  @belongsTo(() => TbProdutoComercial, {
    foreignKey: "id_prodcomerc_pr"
  })
  public produtoComercialParceiro: BelongsTo<typeof TbProdutoComercial>

  @hasMany(() => TbTokenIdParc, {
    foreignKey: 'nu_IdParceiro_tk'
  })
  public tokenidparc: HasMany<typeof TbTokenIdParc>
}
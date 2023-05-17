import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercialParceiro from './TbProdutoComercialParceiro'
import TbTokenIdParc from './TbTokenIdParc'

export default class Parceiro extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @belongsTo(() => TbProdutoComercialParceiro, {
    foreignKey: 'id_prodcomerc_pr',
  })
  public produtoComercialParceiro: BelongsTo<typeof TbProdutoComercialParceiro>

  @belongsTo(() => TbTokenIdParc, {
    foreignKey: 'nu_IdParceiro_tk',
  })
  public tokenidparc: BelongsTo<typeof TbTokenIdParc>
}

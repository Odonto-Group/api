import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercialParceiro from './TbProdutoComercialParceiro'

export default class TbAbrangeRegiao extends BaseModel {
    @column({ isPrimary: true })
    public id: number
  
    @belongsTo(() => TbProdutoComercialParceiro, {
      foreignKey: 'id_prodcomerc_abr',
    })
    public produtoComercialParceiro: BelongsTo<typeof TbProdutoComercialParceiro>
  
    @column()
    public id_uf_r: number
}
  
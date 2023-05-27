import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercial from './TbProdutoComercial'

export default class TbAbrangeRegiao extends BaseModel {
    public static table = 'tb_AbrangRegiao'

    @column({ isPrimary: true })
    public id: number
  
    @belongsTo(() => TbProdutoComercial, {
      foreignKey: 'id_prodcomerc_abr',
    })
    public produtoComercial: BelongsTo<typeof TbProdutoComercial>
  
    @column()
    public id_uf_r: number
}
  
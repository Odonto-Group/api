import { BaseModel, column, belongsTo, HasMany, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbAbrangeRegiao from './TbAbrangeRegiao'
import TbCategoria from './TbCategoria'
import TbFormasPagamento from './TbFormasPagamento'
import TbModProduto from './TbModProduto'
import TbTipoPreco from './TbTipoPreco'
import TipoPreco from './TbTipoPreco'

export default class TbProdutoComercialParceiro extends BaseModel {
    public static table = 'tb_ProdutoComercial'

    @column({ isPrimary: true })
    public id_prodcomerc: number
  
    @column()
    public nu_PublicaInt: number
  
    @column()
    public en_status: number
  
    @column()
    public en_SitCarencia: number
  
    @belongsTo(() => TbModProduto, {
      foreignKey: 'id_modproduto_c',
    })
    public modalidade: BelongsTo<typeof TbModProduto>
  
    @hasMany(() => TbAbrangeRegiao, {
      foreignKey: 'id_prodcomerc_abr',
    })
    public abrangeRegiao: HasMany<typeof TbAbrangeRegiao>
  
    @belongsTo(() => TbCategoria, {
      foreignKey: 'id_categoria_c',
    })
    public categoria: BelongsTo<typeof TbCategoria>
  
    @belongsTo(() => TipoPreco, {
      foreignKey: 'id_TipoPreco_c',
    })
    public tipoPreco: BelongsTo<typeof TbTipoPreco>
  
    @hasMany(() => TbFormasPagamento, {
      foreignKey: 'id_prodcomerc_if',
    })
    public formasPagamento: HasMany<typeof TbFormasPagamento>
}
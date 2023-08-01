import { BaseModel, column, belongsTo, HasMany, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbAbrangeRegiao from './TbAbrangeRegiao'
import TbCategoria from './TbCategoria'
import TbFormasPagamentoIndividual from './TbFormasPagamentoIndividual'
import TbModProduto from './TbModProduto'
import TbTipoPreco from './TbTipoPreco'
import TipoPreco from './TbTipoPreco'
import TbParceiro from './TbParceiro'
import TbAssociado from './TbAssociado'
import TbEmpresa from './TbEmpresa'
import TbFormasPagamentoEmpresa from './TbFormasPagamentoEmpresa'
import TbProdutoS4E from './TbProdutoS4E'

export default class TbProdutoComercial extends BaseModel {
    public static table = 'tb_ProdutoComercial'

    @column({ isPrimary: true })
    public id_prodcomerc: number;
  
    @column({columnName: 'nm_prodcomerc'})
    public nm_prodcomerc: string;
  
    @column()
    public dataInicioCorte: number;
  
    @column()
    public dataFimCorte: number;
  
    @column()
    public en_status: number;
  
    @column({ columnName: 'id_modproduto_c' })
    public id_modproduto_c: number;
  
    @column()
    public nu_PublicaInt: number;
  
    @column({ columnName: 'id_ProdutoS4E_c' })
    public id_ProdutoS4E_c: number;
  
    @column()
    public nu_CodDeptoEmpS4E: number;
  
    @column()
    public nm_NmDeptoEmpS4E: string;
  
    @column()
    public en_responsavel: 'ativo' | 'inativo';
  
    @column()
    public en_familia: 'ativo' | 'inativo';
  
    @column()
    public en_especial: number;
  
    @column({ columnName: 'id_categoria_c' })
    public id_categoria_c: number;
  
    @column({ columnName: 'id_TipoPreco_c' })
    public id_TipoPreco_c: number;
  
    @column()
    public ativa_img: boolean;
  
    @column({ columnName: 'HabilitaUpDoc' })
    public HabilitaUpDoc: number;
  
    @column({ columnName: 'en_SitCarencia' })
    public en_SitCarencia: boolean;
    
    @hasMany(() => TbParceiro)
    public parceiro: HasMany<typeof TbParceiro>

    @hasMany(() => TbEmpresa)
    public empresa: HasMany<typeof TbEmpresa>
  
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
  
    @hasMany(() => TbFormasPagamentoIndividual, {
      foreignKey: 'id_prodcomerc_if',
    })
    public formasPagamentoIndividual: HasMany<typeof TbFormasPagamentoIndividual>

    @hasMany(() => TbFormasPagamentoEmpresa, {
      foreignKey: 'id_prodcomerc_fc',
    })
    public formasPagamentoEmpresa: HasMany<typeof TbFormasPagamentoEmpresa>

    @belongsTo(() => TbProdutoS4E, {
      foreignKey: 'id_ProdutoS4E_c'
    })
    public produtoS4E: BelongsTo<typeof TbProdutoS4E>
}
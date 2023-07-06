import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import TbTokenIdParc from './TbTokenIdParc'
import TbProdutoComercial from './TbProdutoComercial'

export default class TbParceiro extends BaseModel {
  public static table = 'tb_parceiro'

  @column({ isPrimary: true })
  public id_parceiro: number

  @column()
  public nm_prodcomerc: string

  @column()
  public dataInicioCorte: number | null

  @column()
  public dataFimCorte: number | null

  @column()
  public en_status: number

  @column()
  public id_modproduto_c: number

  @column()
  public nu_PublicaInt: number

  @column()
  public id_ProdutoS4E_c: number

  @column()
  public nu_CodDeptoEmpS4E: number | null

  @column()
  public nm_NmDeptoEmpS4E: string | null

  @column()
  public en_responsavel: 'ativo' | 'inativo'

  @column()
  public en_familia: 'ativo' | 'inativo' | null

  @column()
  public en_especial: number | null

  @column()
  public id_categoria_c: number

  @column()
  public id_TipoPreco_c: number

  @column()
  public ativa_img: number | null

  @column()
  public HabilitaUpDoc: number

  @column({columnName: "en_SitCarencia"})
  public en_SitCarencia: number | null

  @column({columnName: 'id_prodcomerc_pr'})
  public id_prodcomerc_pr: number

  @belongsTo(() => TbProdutoComercial, {
    foreignKey: "id_prodcomerc_pr"
  })
  public produtoComercial: BelongsTo<typeof TbProdutoComercial>

  @hasMany(() => TbTokenIdParc)
  public tokenidparc: HasMany<typeof TbTokenIdParc>
}
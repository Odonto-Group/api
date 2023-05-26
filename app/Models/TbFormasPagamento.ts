import { BaseModel, BelongsTo, belongsTo, column, manyToMany } from "@ioc:Adonis/Lucid/Orm"
import TbProdutoComercial from "./TbProdutoComercialParceiro"
import TbBanco from "./TbBanco"

export default class TbFormasPagamento extends BaseModel {
    public static table = 'tb_formaspgtoIF'
  
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public vl_valor: number

    @column()
    public nu_PagUnico: number;

    @column()
    public id_prodcomerc_if: number;

    @column()
    public cd_CodContratoS4E: number;
  
    @belongsTo(() => TbProdutoComercial, {
      foreignKey: 'id_prodcomerc_if'
    })
    public produtoComercialParceiro: BelongsTo<typeof TbProdutoComercial>
}
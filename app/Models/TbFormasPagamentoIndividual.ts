import { BaseModel, BelongsTo, belongsTo, column, manyToMany } from "@ioc:Adonis/Lucid/Orm"
import TbMeioPagamento from "./TbMeioPagamento"
import TbProdutoComercial from "./TbProdutoComercial"

export default class TbFormasPagamentoIndividual extends BaseModel {
    public static table = 'tb_formaspgtoIF'
  
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public vl_valor: number

    @column({columnName: 'nu_PagUnico'})
    public nu_PagUnico: number;

    @column()
    public id_prodcomerc_if: number;

    @column({columnName: 'cd_CodContratoS4E'})
    public cd_CodContratoS4E: number;

    @column()
    public id_meiopagto_if: number;
  
    @belongsTo(() => TbProdutoComercial, {
      foreignKey: 'id_prodcomerc_if'
    })
    public produtoComercial: BelongsTo<typeof TbProdutoComercial>

    @belongsTo(() => TbMeioPagamento, {
      foreignKey: 'id_meiopagto_if'
    })
    public meioPagamentoIndividual: BelongsTo<typeof TbMeioPagamento>
}
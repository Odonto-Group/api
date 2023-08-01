import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm"
import TbMeioPagamento from "./TbMeioPagamento"
import TbProdutoComercial from "./TbProdutoComercial"

export default class TbFormasPagamentoEmpresa extends BaseModel {
    public static table = 'tb_formaspgtoCol'
  
    @column({ isPrimary: true })
    public id_formaspagtocol: number
  
    @column({ columnName: "vl_valor"})
    public vl_valor: number

    @column({columnName: 'nu_PagUnico'})
    public nu_PagUnico: number;

    @column()
    public id_prodcomerc_fc: number;

    @column({columnName: 'cd_CodContratoS4E'})
    public cd_CodContratoS4E: number;

    @column()
    public id_meiopagto_fc: number;
  
    @belongsTo(() => TbProdutoComercial, {
      foreignKey: 'id_prodcomerc_fc'
    })
    public produtoComercial: BelongsTo<typeof TbProdutoComercial>

    @belongsTo(() => TbMeioPagamento, {
      foreignKey: 'id_meiopagto_fc'
    })
    public meioPagamentoEmpresa: BelongsTo<typeof TbMeioPagamento>
}
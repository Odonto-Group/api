import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm"
import TbProdutoComercialParceiro from "./TbProdutoComercialParceiro"

export default class TbFormasPagamento extends BaseModel {
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public vl_valor: number
  
    @belongsTo(() => TbProdutoComercialParceiro, {
      foreignKey: 'id_prodcomerc_if'
    })
    public tbProdutoComercialParceiro: BelongsTo<typeof TbProdutoComercialParceiro>

}
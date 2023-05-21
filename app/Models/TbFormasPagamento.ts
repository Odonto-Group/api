import { BaseModel, BelongsTo, belongsTo, column, manyToMany } from "@ioc:Adonis/Lucid/Orm"
import TbProdutoComercialParceiro from "./TbProdutoComercialParceiro"
import TbBanco from "./TbBanco"

export default class TbFormasPagamento extends BaseModel {
    public static table = 'tb_formaspgtoIF'
  
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public vl_valor: number

    @column()
    public nu_PagUnico: number;
  
    @belongsTo(() => TbProdutoComercialParceiro, {
      foreignKey: 'id_prodcomerc_if'
    })
    public tbProdutoComercialParceiro: BelongsTo<typeof TbProdutoComercialParceiro>

    public banco = () => {
      return manyToMany(
        () => TbBanco,
        {
          pivotTable: 'tb_formabco',
          localKey: 'id',  // assegure-se de usar o nome correto da chave primária aqui
          pivotForeignKey: 'id_formaspgtoIF_fb',
          relatedKey: 'id',  // assegure-se de usar o nome correto da chave primária aqui
          pivotRelatedForeignKey: 'id_banco_fb',
        }
      )
    }
}
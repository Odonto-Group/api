import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercialParceiro from './TbProdutoComercialParceiro'

export default class TbBanco extends BaseModel {
    public static table = 'tb_banco'

    @column({isPrimary: true})
    public id_banco: number;


}
  
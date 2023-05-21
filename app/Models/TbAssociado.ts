import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import TbProdutoComercialParceiro from './TbProdutoComercialParceiro'

export default class TbAssociado extends BaseModel {
    public static table = 'tb_associado'

    @column({ isPrimary: true })
    public id: number;

    @column()
    public nu_cpf: string;

    @column()
    public cd_status: number;

}
  
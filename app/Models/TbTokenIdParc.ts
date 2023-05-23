import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TbParceiro from './TbParceiro';

export default class TbTokenIdParc extends BaseModel {
  public static table = 'tb_tokenidparc'
  
  @column({ isPrimary: true })
  public id_tokenidparc: number

  @column({ columnName: 'nu_idParceiro_tk'})
  public nu_idParceiro_tk: number

  @belongsTo(() => TbParceiro)
  public parceiro: BelongsTo<typeof TbParceiro>
}
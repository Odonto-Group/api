import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TbParceiro from './TbParceiro';

export default class TbTokenIdParc extends BaseModel {
  public static table = 'tb_tokenidparc'
  
  @column({ isPrimary: true })
  public id_tokenidparc: number

  @column({ columnName: 'nu_IdParceiro_tk'})
  public nu_IdParceiro_tk: number

  @belongsTo(() => TbParceiro)
  public parceiro: BelongsTo<typeof TbParceiro>
}
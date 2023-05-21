import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TbParceiro from './TbParceiro';

export default class TbTokenIdParc extends BaseModel {
  public static table = 'tb_TokenIdParc'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nu_IdParceiro_tk: number

  @column()
  public cd_Codtokenidparc: string

  @belongsTo(() => TbParceiro, {
    foreignKey: 'nu_IdParceiro_tk',
  })
  public parceiro: BelongsTo<typeof TbParceiro>
  
}
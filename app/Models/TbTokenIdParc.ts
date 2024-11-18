import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TbParceiro from './TbParceiro';
import TbCorretora from './TbCorretora';
import TbVendedor from './TbVendedor';

export default class TbTokenIdParc extends BaseModel {
  public static table = 'tb_tokenidparc'
  
  @column()
  public id_tokenidparc: number

  @column({columnName: 'nu_cdVendedor4E_tk'})
  public nu_cdVendedor4E_tk: number

  @column({columnName: 'nu_cdCorretoraS4E_tk'})
  public nu_cdCorretoraS4E_tk: number

  @column({columnName: 'nu_IdParceiro_tk'})
  public nu_IdParceiro_tk: number

  @column({columnName:  'cd_Codtokenidparc'})
  public cd_Codtokenidparc: string

  @column()
  public short_url_apresentacao: string

  @column()
  public short_url_checkout: string

  @column()
  public short_url_vendedor: string

  @column()
  public status_token: string

  @column()
  public tknAtualizado: string

  @belongsTo(() => TbParceiro, {
    foreignKey: 'nu_IdParceiro_tk'
  })
  public parceiro: BelongsTo<typeof TbParceiro>

  @belongsTo(() => TbCorretora, {
    foreignKey: 'nu_cdCorretoraS4E_tk'
  })
  public corretora: BelongsTo<typeof TbCorretora>

  @belongsTo(() => TbVendedor, {
      foreignKey: 'nu_cdVendedor4E_tk',
      localKey: 'nu_cdVendedorS4E'
  })
  public vendedor: BelongsTo<typeof TbVendedor>

}
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TbFormasPagamento from './TbFormasPagamento'

export default class CarenciaProduto extends BaseModel {
  public static table = 'tb_meiopagto'

  @column({ isPrimary: true })
  public id_meiopagto: number;
  
  @column()
  public cd_codmeiopagto: number;
  
  @column()
  public nm_meiopagto: string;
  
  @column()
  public cd_gmeiopagto: number | null;
  
  @column()
  public nu_status: number;

  @hasMany(() => TbFormasPagamento, {
    foreignKey: 'id_prodcomerc_if',
  })
  public formasPagamento: HasMany<typeof TbFormasPagamento>
}
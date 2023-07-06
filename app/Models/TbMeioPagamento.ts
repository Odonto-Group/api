import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TbFormasPagamentoIndividual from './TbFormasPagamentoIndividual'
import TbFormasPagamentoEmpresa from './TbFormasPagamentoEmpresa';

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

  @hasMany(() => TbFormasPagamentoIndividual, {
    foreignKey: 'id_prodcomerc_if',
  })
  public formasPagamentoIndividual: HasMany<typeof TbFormasPagamentoIndividual>

  @hasMany(() => TbFormasPagamentoEmpresa, {
    foreignKey: 'id_prodcomerc_fc',
  })
  public formasPagamentoEmpresa: HasMany<typeof TbFormasPagamentoEmpresa>
}
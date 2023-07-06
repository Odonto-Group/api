import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class TbDependenteFuncional extends BaseModel {
  public static table = 'tb_dependente_funcional';

  @column({ isPrimary: true })
  public id_dependente: number;

  @column()
  public id_funcionario_df: number;

  @column()
  public nm_dependente: string;

  @column()
  public nu_cpf: string;

  @column()
  public nu_rg: string;

  @column()
  public ds_orgao_expedidor: string;

  @column()
  public nu_cns: string;

  @column()
  public dt_nasc: string;

  @column()
  public nm_mae: string;

  @column()
  public id_sexo_df: number;

  @column()
  public id_parentesco_df: number;

  @column()
  public id_prodcomerc_df: number;

  @column()
  public vl_valor: number;

  @column()
  public ds_email: string;

  @column()
  public documento_vinculo: string;
}
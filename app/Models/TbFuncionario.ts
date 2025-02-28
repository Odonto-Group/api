import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm';
import TbDependenteFuncional from './TbDependenteFuncional';

export default class TbFuncionario extends BaseModel {
  public static table = 'tb_funcionario';

  @column({ isPrimary: true })
  public id_funcionario: number;

  @column()
  public id_cdempresa_f: number;

  @column()
  public nm_funcionario: string;

  @column()
  public nu_cpf: string;

  @column()
  public nu_cns: string;

  @column()
  public nu_rg: string;

  @column()
  public ds_orgao_expedidor: string;

  @column()
  public dt_nascimento: string;

  @column()
  public id_sexo_f: number;

  @column()
  public id_parentesco_f: number;

  @column()
  public nm_mae: string;

  @column()
  public nu_dddfixo: string;

  @column()
  public nu_telefone: string;

  @column()
  public nu_dddcelular: string;

  @column()
  public nu_celular: string;

  @column()
  public ds_email: string;

  @column()
  public id_prodcomerc_f: number;

  @column({columnName: "DT_CADASTRO"})
  public DT_CADASTRO: string;

  @column()
  public tipo_plano: number;

  @column({columnName: "cd_codcontratoS4E"})
  public cd_codcontratoS4E: number;

  @column()
  public nu_matriculafuncional: string;

  @column()
  public id_uf_f: number;

  @column({columnName: "nu_CEP"})
  public nu_CEP: string;

  @column({columnName: "tx_EndLograd"})
  public tx_EndLograd: string;

  @column({columnName: "tx_EndNumero"})
  public tx_EndNumero: string;

  @column({columnName: "tx_EndCompl"})
  public tx_EndCompl: string;

  @column({columnName: "tx_EndBairro"})
  public tx_EndBairro: string;

  @column({columnName: "tx_EndCidade"})
  public tx_EndCidade: string;

  @hasMany(() => TbDependenteFuncional, {
    foreignKey: 'id_funcionario_df',
  })
  public dependentes!: HasMany<typeof TbDependenteFuncional>;
}
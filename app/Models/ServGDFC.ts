import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ServGDFC extends BaseModel {
    public static table = 'ServGDFC'

  @column()
  public Nome_Servidor: string

  @column()
  public CPF: string

  @column()
  public Nm_ORGAO : string

  @column()
  public Cargo_serv: string

  @column()
  public Func_servidor: string

  @column()
  public Sit_servidor: string

  @column()
  public Cod_Orgao_serv : string

  @column()
  public Matric_Servidor: string
}

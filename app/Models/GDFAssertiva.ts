import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class GDFAssertiva extends BaseModel {
  public static table = 'GDFAssertiva'

  @column()
  public CPF: string

  @column()
  public NOME: string

  @column()
  public DATA_NASCIMENTO: string

  @column()
  public IDADE: string

  @column()
  public SEXO: string

  @column()
  public MAE_NOME: string

  @column()
  public ENDERECO_01_CEP: string

  @column()
  public NUMERO1: string

  @column()
  public COMPLEMENTO1: string

  @column()
  public EMAIL1: string

  @column()
  public CELULAR1: string

  @column()
  public MATRICULA: string
}

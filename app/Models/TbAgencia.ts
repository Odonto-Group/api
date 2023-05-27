import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbAgencia extends BaseModel {
    public static table = 'tb_agencia'

  @column({ isPrimary: true })
  public cd_codigo: string

  @column()
  public nm_agencia: string
}

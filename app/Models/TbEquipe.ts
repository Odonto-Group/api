import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbEquipe extends BaseModel {
  public static table = 'tb_equipe'

  @column({ isPrimary: true })
  public codigo: string

  @column()
  public nm_equipe: string
}
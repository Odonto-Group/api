import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPerfilServidor extends BaseModel {
  public static table = 'tb_PerfilServidor'

  @column({ isPrimary: true })
  public id_perfil: number

  @column()
  public tx_perfil: string | null
}

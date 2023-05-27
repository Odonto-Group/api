import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbPromotor extends BaseModel {
    public static table = 'tb_promotor'

    @column({ isPrimary: true })
    public cd_matricula: string

    @column()
    public nm_promotor: string

    @column()
    public id_equipe: string | null

    @column()
    public bl_interno: number | null
}

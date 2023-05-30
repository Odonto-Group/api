import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class TbUf extends BaseModel {
    public static table = 'tb_UF'

    @column({isPrimary: true})
    public id_uf: number;

    @column()
    public sigla: string;

}
  
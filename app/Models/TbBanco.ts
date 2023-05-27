import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class TbBanco extends BaseModel {
    public static table = 'tb_banco'

    @column({isPrimary: true})
    public id_banco: number;


}
  
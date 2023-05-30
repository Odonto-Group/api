import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class TbBanco extends BaseModel {
    public static table = 'tb_banco'

    @column({isPrimary: true})
    public id_banco: number;

    @column({isPrimary: true})
    public cd_banco: string;

    @column({isPrimary: true})
    public nm_banco: number;

    @column({isPrimary: true})
    public nu_statusbco: number;
}
  
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TbBanco extends BaseModel {
    public static table = 'tb_banco'

    @column({isPrimary: true})
    public id_banco: number;

    @column()
    public cd_banco: string;

    @column()
    public nm_banco: number;

    @column()
    public nu_statusbco: number;
}
  
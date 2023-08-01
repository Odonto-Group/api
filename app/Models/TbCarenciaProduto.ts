import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import TbCarencia from "./TbCarencia";

export default class TbCarenciaProduto extends BaseModel {
    public static table = "tb_carenciaprod";

    @column({ isPrimary: true })
    public id_carenciaprod: number;

    @column()
    public id_carencia_pr: number;

    @column()
    public id_prodcomerc_pr: number;

    @column()
    public nu_status: string;

    @belongsTo(() => TbCarencia, {
        foreignKey: 'id_carencia_pr'
    })
    public carencia: BelongsTo<typeof TbCarencia>
}
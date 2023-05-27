import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import TbCarenciaProduto from "./TbCarenciaProduto";

export default class TbCarencia extends BaseModel {
    public static table = "tb_carencia";

    @column({ isPrimary: true })
    public id_carencia: number;

    @column()
    public nm_descricaocarencia: string;

    @column()
    public nu_status: number;

    @column()
    public nu_ordemSite: number;

    @belongsTo(() => TbCarenciaProduto)
    public carenciaProduto: BelongsTo<typeof TbCarenciaProduto>
}
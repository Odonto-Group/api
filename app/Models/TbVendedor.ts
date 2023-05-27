import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import TbTokenIdParc from "./TbTokenIdParc";

export default class TbVendedor extends BaseModel {
    public static table = "tb_vendedor";

    @column({ isPrimary: true })
    public id_vendedor: number;

    @column()
    public tx_nome: string;

    @column()
    public nu_cpf: string;

    @column()
    public nu_cdVendedorEasy: number;

    @column()
    public nu_cdVendedorS4E: number;

    @column()
    public nu_idParceiro: number;

    @column()
    public id_Corretorav: number;

    @column()
    public nu_dddcel: number;

    @column()
    public nu_telcelular: number;

    @column()
    public ds_email: string;

    @column()
    public en_status: "ativo" | "inativo";

    @column()
    public foto_vendedor: string;

    @column()
    public bl_ativo: boolean;

    @hasMany(() => TbTokenIdParc, {
        foreignKey: 'nu_IdParceiro_tk'
    })
    public tokenidparc: HasMany<typeof TbTokenIdParc>
}
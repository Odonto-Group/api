import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import TbTokenIdParc from "./TbTokenIdParc";

export default class TbCorretora extends BaseModel {
public static table = "tb_corretora";

@column({ isPrimary: true })
public id_corretora: number;

@column()
public nm_razao_social: string;

@column()
public nu_cnpj: string;

@column()
public nu_CdCorretoraEasy: number;

@column()
public nu_CdCorretoraS4E: number;

@column()
public nu_status: number;

@column()
public nu_cdequipe: number;

@column()
public tx_UF: string;

@hasMany(() => TbTokenIdParc, {
    foreignKey: 'nu_IdParceiro_tk'
  })
  public tokenidparc: HasMany<typeof TbTokenIdParc>
}
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class TbPagamentoBoletoOdontoCob extends BaseModel {
    public static table = 'tb_pgtoboletoOdontocob';

    @column({ isPrimary: true })
    public id_pagtoboleto: number;

    @column()
    public cd_cliente: number;

    @column()
    public dt_gerado: string;

    @column()
    public id_banco_pbo: number;

    @column()
    public nu_idboleto_odontocob: string;

    @column()
    public nu_valoremissao: number;

    @column()
    public dt_vencimento: string;

    @column()
    public dt_emissao: string;

    @column()
    public dt_pagamento: string;

    @column()
    public vl_valorpago: number;

    @column()
    public tx_linkboleto_odontocob: string;

    @column({columnName: "nu_statusboleto"})
    public nu_statusboleto: number;

    @column()
    public nu_unico: number;

    @column({columnName: "tx_linhaDigitavel"})
    public tx_linhaDigitavel: string;

    @column({columnName: "tx_codigoBarra"})
    public tx_codigoBarra: string;

    @column()
    public tipo_cliente: string;
s
    @column({columnName: "nossoNumero"})
    public nossoNumero: string;

    @column()
    public nr_proposta: string;

    @column({columnName: "blAtivo"})
    public blAtivo: boolean;
}
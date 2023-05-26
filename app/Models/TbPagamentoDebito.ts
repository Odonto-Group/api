import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class TbPagamentoDebito extends BaseModel {
  public static table = 'tb_pgtodebito';

  @column({ isPrimary: true })
  public id_pagtodebito: number;

  @column()
  public cd_associado_pd: number;

  @column()
  public id_banco_pd: number;

  @column()
  public nu_agencia: string;

  @column()
  public nu_conta: string;

  @column()
  public nu_valor: number;

  @column()
  public ds_vencimento: string;

  @column()
  public nu_OperacaoCEF: string = '0';
}
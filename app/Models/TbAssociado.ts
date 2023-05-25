import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Associado extends BaseModel {
  public static table = 'tb_associado'

  @column({ isPrimary: true })
  public id_associado: number

  @column()
  public nm_associado: string

  @column()
  public nm_mae: string

  @column()
  public nu_cpf: string

  @column()
  public nu_cns: string

  @column()
  public nu_rg: string

  @column()
  public ds_OrgaoExpedidor: string

  @column()
  public dt_nasc: string

  @column()
  public ds_email: string

  @column()
  public id_sexo_a: number

  @column()
  public id_EstadoCivil_a: number

  @column()
  public nu_codprodutoS4E: number

  @column()
  public cd_CodContratoS4E: number

  @column()
  public nu_CodDeptoEmpS4E: number

  @column()
  public id_prodcomerc_a: number

  @column()
  public dt_dia_vencto: number

  @column()
  public nu_dddtelfixo: string

  @column()
  public nu_telefixo: string

  @column()
  public nu_ramaltelfixo: string

  @column()
  public nu_dddCel: string

  @column()
  public nu_Celular: string

  @column()
  public nu_tipo_servidor: number

  @column()
  public nu_vl_mensalidade: number

  @column()
  public dt_operacao: string

  @column()
  public dt_inicio_vigencia: DateTime

  @column()
  public nu_motivo_cancelamento: number

  @column()
  public id_meiopagto_a: number

  @column()
  public id_FontePag_a: number

  @column()
  public id_orgao_a: number

  @column()
  public cd_perfil: number

  @column()
  public nu_MatriculaFuncional: string

  @column()
  public tx_Cargo: string

  @column()
  public tx_lotacao: string

  @column()
  public cd_situacao: number

  @column()
  public dt_Cadastro: string

  @column()
  public cd_status: number

  @column()
  public dt_alteraStatus: string

  @column()
  public cd_entidade: number

  @column()
  public cd_modulo: number

  @column()
  public id_vendedor_a: number

  @column()
  public id_parentesco_a: number

  @column()
  public nu_CEP: number

  @column()
  public tx_EndLograd: string

  @column()
  public nu_EndNumero: string

  @column()
  public tx_EndCompl: string

  @column()
  public tx_EndBairro: string

  @column()
  public tx_EndCidade: string

  @column()
  public id_UF_a: number

  @column()
  public st_mail: number

  @column()
  public nu_cpfAdesionista: string

  @column()
  public st_sitProp: string

  @column()
  public nr_proposta: string

  @column()
  public id_origemVenda: number

  @column()
  public dt_dataprimvenc: DateTime

  @column()
  public telemedicina: number

  @column()
  public telemedicina_solicitado: number
}

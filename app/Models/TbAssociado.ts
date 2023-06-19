import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TbResponsavelFinanceiro from './TbResponsavelFinanceiro'

export default class TbAssociado extends BaseModel {
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

  @column({columnName: "ds_OrgaoExpedidor"})
  public ds_OrgaoExpedidor: string

  @column()
  public dt_nasc: string

  @column()
  public ds_email: string

  @column()
  public id_sexo_a: number

  @column({columnName: "ds_OrgaoExpedidor"})
  public id_EstadoCivil_a: number

  @column({columnName: "nu_codprodutoS4E"})
  public nu_codprodutoS4E: number

  @column({columnName: "cd_CodContratoS4E"})
  public cd_CodContratoS4E: number

  @column({columnName: "nu_CodDeptoEmpS4E"})
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

  @column({columnName: "nu_dddCel"})
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
  public dt_inicio_vigencia: string

  @column()
  public nu_motivo_cancelamento: number

  @column()
  public id_meiopagto_a: number

  @column({columnName: "id_FontePag_a"})
  public id_FontePag_a: number

  @column()
  public id_orgao_a: number

  @column()
  public cd_perfil: number

  @column({columnName: "nu_MatriculaFuncional"})
  public nu_MatriculaFuncional: string

  @column({columnName: "tx_Cargo"})
  public tx_Cargo: string

  @column()
  public tx_lotacao: string

  @column()
  public cd_situacao: number

  @column()
  public dt_Cadastro: string

  @column()
  public cd_status: number

  @column({columnName: "dt_alteraStatus"})
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

  @column({columnName: "tx_EndLograd"})
  public tx_EndLograd: string

  @column({columnName: "nu_EndNumero"})
  public nu_EndNumero: string

  @column({columnName: "tx_EndCompl"})
  public tx_EndCompl: string

  @column({columnName: "tx_EndBairro"})
  public tx_EndBairro: string

  @column({columnName: "tx_EndCidade"})
  public tx_EndCidade: string

  @column({columnName: 'id_UF_a'})
  public id_UF_a: number

  @column()
  public st_mail: number

  @column({columnName: "nu_cpfAdesionista"})
  public nu_cpfAdesionista: string

  @column({columnName: "st_sitProp"})
  public st_sitProp: string

  @column()
  public nr_proposta: string

  @column({columnName: "id_origemVenda"})
  public id_origemVenda: number

  @column()
  public dt_dataprimvenc: string

  @hasMany(() => TbResponsavelFinanceiro, { 
    foreignKey: 'id_associado_rf',
    localKey: 'id_associado'
  })
  public responsavelFinanceiro: HasMany<typeof TbResponsavelFinanceiro>

  setOrgaoExpedidor(orgao_expedidor: any, orgao_expedidor_uf: any) {
    this.ds_OrgaoExpedidor = orgao_expedidor + '-' + orgao_expedidor_uf
  }

  setCelularAttribute(value: string) {
    value = value ? value.replace(/\D/g, "") : "00000000000"
    this.nu_dddCel = value.substring(0, 2);
    this.nu_Celular = value.substring(2, 11);
  }
}

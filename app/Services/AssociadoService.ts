import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import TbAssociado from 'App/Models/TbAssociado';
import TbFormasPagamento from 'App/Models/TbFormasPagamento';
import TbOrgaoExpedidor from 'App/Models/TbOrgaoExpedidor';
import { DateTime } from 'luxon';

export default class AssociadoService {
  
  async updateAssociadoPagamentoEfetuado(associado: TbAssociado) {
      const dataPagamento = DateTime.now().toFormat("yyyy-MM-dd")

      await TbAssociado.query()
        .where('id_associado', associado.id_associado)
        .update({ cd_status: 2, dt_alteraStatus: dataPagamento, dt_inicio_vigencia: dataPagamento})
  }

  async ativarPlanoAssociado(associado: TbAssociado, transaction: TransactionClientContract) {
    await TbAssociado.query()
      .where("id_associado", associado.id_associado)
      .useTransaction(transaction)
      .update({cd_status: 1})
  }

  async saveAssociado(associado: TbAssociado, transaction: TransactionClientContract) {
    await associado.useTransaction(transaction).save()
  }

  async findAssociadoByCpf(cpfAssociado: string): Promise<TbAssociado> {
    const associado = await TbAssociado
    .query()
    .preload('responsavelFinanceiro')
    .where("nu_cpf", cpfAssociado)
    .first();

    return associado || new TbAssociado;

  }

  async findAssociadoById(idAssociado: number): Promise<TbAssociado> {
    const associado = await TbAssociado
    .query()
    .preload('responsavelFinanceiro')
    .where('id_associado', idAssociado)
    .first();

    return associado || new TbAssociado;
  }

  async findAssociadoByNossoNumeroBoleto(nossoNumero: number): Promise<TbAssociado> {
    const associado = await TbAssociado
    .query()
    .preload('responsavelFinanceiro')
    .innerJoin('tb_pgtoboletoOdontocob', 'tb_pgtoboletoOdontocob.cd_cliente', 'tb_associado.id_associado')
    .where('tb_pgtoboletoOdontocob.nossoNumero', nossoNumero)
    .first();

    return associado || new TbAssociado;
  }


  async buildAssociado(associado: TbAssociado, params: any, orgaoExpedidor: TbOrgaoExpedidor, formaPagamento: TbFormasPagamento, valorContrato: number, dataExpiracao: DateTime, idVendedor: number) {
    associado.nm_associado = params.nomeTitular
    associado.nu_cpf = params.cpf;
    associado.nm_mae = params.nomeMae;
    associado.nu_cns = params.cns;
    associado.nu_rg = params.rg;
    associado.dt_nasc = params.dataNascimento;
    associado.ds_email = params.emailTitular;
    associado.id_sexo_a = params.idSexo;
    associado.id_EstadoCivil_a = params.estadoCivil;
  
    associado.setCelularAttribute(params.celular);
    associado.setOrgaoExpedidor(orgaoExpedidor.sigla, orgaoExpedidor.nm_orgaoexpedidor);
    
    associado.id_FontePag_a = params.fontePagadora || null;
    associado.id_orgao_a = params.orgao || null;
    associado.cd_perfil = params.perfil || null;
    associado.nu_MatriculaFuncional = params.matricula || null;
    associado.tx_Cargo = params.cargo || null;
    associado.dt_operacao = DateTime.local().toFormat('f');
    associado.dt_Cadastro = DateTime.local().toFormat('f');
    associado.dt_alteraStatus = DateTime.local().toFormat('yyyy/MM/dd');
    associado.id_parentesco_a = 1;
    associado.nu_CEP = params.cep;
    associado.tx_EndLograd = params.endereco;
    associado.nu_EndNumero = params.numeroCasa;
    associado.tx_EndCompl = params.complemento || "";
    associado.tx_EndBairro = params.bairro;
    associado.tx_EndCidade = params.cidade;
    associado.id_UF_a = params.idUf
    associado.id_origemVenda = 99; // TODO 5
    associado.id_vendedor_a = idVendedor
    associado.cd_CodContratoS4E = formaPagamento.cd_CodContratoS4E

    associado.dt_dia_vencto = DateTime.local().day;
    associado.nu_vl_mensalidade = valorContrato;

    associado.id_meiopagto_a = params.formaPagamento.gpPagto;
    associado.dt_dataprimvenc = dataExpiracao.toFormat('yyyy/MM/dd');
    associado.dt_inicio_vigencia = DateTime.local().toFormat('yyyy/MM/dd');
    associado.cd_status = 0;
    associado.st_mail = 0;

    associado.nr_proposta = this.gerarNumeroProposta()
    associado.id_prodcomerc_a = formaPagamento.produtoComercial.id_prodcomerc;
  }
  

  private gerarNumeroProposta() {
    const now = DateTime.local();
    
    const year = now.toFormat('yyyy');
    const month = now.toFormat('MM');
    
    const timestamp = Math.floor(now.toMillis() / 1000);
    
    return `${year}${month}${timestamp}`;
  }
}
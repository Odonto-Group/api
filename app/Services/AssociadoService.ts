import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
import TbAssociado from 'App/Models/TbAssociado';
import TbFormasPagamentoIndividual from 'App/Models/TbFormasPagamentoIndividual';
import TbOrgaoExpedidor from 'App/Models/TbOrgaoExpedidor';
import TbUf from 'App/Models/TbUf';
import gerarNumeroProposta from 'App/utils/Proposta';
import { DateTime } from 'luxon';

export default class AssociadoService {
  
  async updateAssociadoPagamentoEfetuado(associado: TbAssociado, transaction: TransactionClientContract) {
      const dataPagamento = DateTime.now().toString()

      await TbAssociado.query()
        .where('id_associado', associado.id_associado)
        .useTransaction(transaction)
        .update({ cd_status: 2, dt_alteraStatus: dataPagamento, dt_inicio_vigencia: dataPagamento})
  }

  async ativarPlanoAssociado(associado: TbAssociado, transaction: TransactionClientContract, cdStatus: number) {
    await TbAssociado.query()
      .where("id_associado", associado.id_associado)
      .useTransaction(transaction)
      .update({cd_status: cdStatus})
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

 
  async buildAssociado(associado: TbAssociado, params: any, formaPagamento: TbFormasPagamentoIndividual, valorContrato: number, dataExpiracao: DateTime, idVendedor: number, transaction: TransactionClientContract) {
    const orgaoExpedidor = await TbOrgaoExpedidor.findOrFail(params.idOrgaoExpedidor)
    const uf = await TbUf.findOrFail(params.idOrgaoExpedidorUf)
    
    associado.nm_associado = params.nomeTitular ? params.nomeTitular.toUpperCase() : "";
    associado.nu_cpf = params.cpf ? params.cpf.replace(/\D/g, "") : "";
    associado.nm_mae = params.nomeMae ? params.nomeMae.toUpperCase() : "";
    associado.nu_cns = params.cns;
    associado.nu_rg = params.rg;
    associado.dt_nasc = DateTime.fromFormat(params.dataNascimento, "dd/MM/yyyy").toString();
    associado.ds_email = params.emailTitular ? params.emailTitular.toUpperCase() : "";
    associado.id_sexo_a = params.idSexo;
    associado.id_EstadoCivil_a = params.idEstadoCivil;
  
    associado.setCelularAttribute(params.celular);
    associado.setOrgaoExpedidor(orgaoExpedidor.sigla, uf.sigla);
    
    associado.id_FontePag_a = params.idFontePagadora || null;
    associado.id_orgao_a = params.orgao || null;
    associado.cd_perfil = params.perfil || null;
    associado.nu_MatriculaFuncional = params.matricula || null;
    associado.tx_Cargo = params.cargo || null;
    associado.dt_operacao = DateTime.now().toString();
    associado.dt_Cadastro = DateTime.now().toString()
    associado.dt_alteraStatus = DateTime.local().toString()
    associado.id_parentesco_a = 1;
    associado.nu_CEP = params.cep ? params.cep.replace(/\D/g, "") : "";
    associado.tx_EndLograd = params.endereco;
    associado.nu_EndNumero = params.numeroCasa;
    associado.tx_EndCompl = params.complemento || "";
    associado.tx_EndBairro = params.bairro;
    associado.tx_EndCidade = params.cidade;
    associado.id_UF_a = params.idUf
    associado.id_origemVenda = 5;
    associado.id_vendedor_a = idVendedor
    associado.cd_CodContratoS4E = formaPagamento.cd_CodContratoS4E

    associado.dt_dia_vencto = dataExpiracao.day;
    associado.nu_vl_mensalidade = valorContrato;

    associado.id_meiopagto_a = params.formaPagamento.gpPagto;
    associado.dt_dataprimvenc = dataExpiracao.toString()
    associado.dt_inicio_vigencia = DateTime.now().toString()
    associado.cd_status = 0;
    associado.st_mail = 0;

    associado.nr_proposta = gerarNumeroProposta()
    associado.id_prodcomerc_a = formaPagamento.produtoComercial.id_prodcomerc;

    await associado.useTransaction(transaction).save()
  }
}
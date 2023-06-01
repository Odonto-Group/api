import TbAssociado from 'App/Models/TbAssociado';
import TbFormasPagamento from 'App/Models/TbFormasPagamento';
import TbUf from 'App/Models/TbUf';
import { DateTime } from 'luxon';

export default class AssociadoService {

  async saveAssociado(associado: TbAssociado, dadosAssociado: TbAssociado) {
    if (!associado) {
      associado = new TbAssociado
    }

    associado.merge(dadosAssociado);

    await associado.save()
  }

  async findAssociado(cpfAssociado: string): Promise<TbAssociado> {
    const associado = await TbAssociado
    .query()
    .where("nu_cpf", cpfAssociado)
    .first();

    return associado || new TbAssociado;

  }

  async buildAssociado(params: any, uf: TbUf, formaPagamento: TbFormasPagamento, valorContrato: number, dataExpiracao: DateTime, idVendedor: number): Promise<TbAssociado> {
    const dadosAssociado = new TbAssociado;
    dadosAssociado.nm_associado = params.nomeTitular
    dadosAssociado.nu_cpf = params.cpf;
    dadosAssociado.nm_mae = params.nomeMae;
    dadosAssociado.nu_cns = params.cns;
    dadosAssociado.nu_rg = params.rg;
    dadosAssociado.dt_nasc = params.dataNascimento;
    dadosAssociado.ds_email = params.emailTitular;
    dadosAssociado.id_sexo_a = params.idSexo;
    dadosAssociado.id_EstadoCivil_a = params.estadoCivil;
  
    dadosAssociado.setCelularAttribute(params.celular);
    dadosAssociado.setOrgaoExpedidor(params.orgaoExpedidor, params.orgaoExpedidorUf);
    
    dadosAssociado.id_FontePag_a = params.fontePagadora || null;
    dadosAssociado.id_orgao_a = params.orgao || null;
    dadosAssociado.cd_perfil = params.perfil || null;
    dadosAssociado.nu_MatriculaFuncional = params.matricula || null;
    dadosAssociado.tx_Cargo = params.cargo || null;
    dadosAssociado.dt_operacao = DateTime.local().toFormat('f');
    dadosAssociado.dt_Cadastro = DateTime.local().toFormat('f');
    dadosAssociado.dt_alteraStatus = DateTime.local().toFormat('yyyy/MM/dd');
    dadosAssociado.id_parentesco_a = 1;
    dadosAssociado.nu_CEP = params.cep;
    dadosAssociado.tx_EndLograd = params.endereco;
    dadosAssociado.nu_EndNumero = params.numeroCasa;
    dadosAssociado.tx_EndCompl = params.complemento || "";
    dadosAssociado.tx_EndBairro = params.bairro;
    dadosAssociado.tx_EndCidade = params.cidade;
    dadosAssociado.id_UF_a = uf.id_uf
    dadosAssociado.id_origemVenda = 99;
    dadosAssociado.id_vendedor_a = idVendedor
    dadosAssociado.cd_CodContratoS4E = formaPagamento.cd_CodContratoS4E

    dadosAssociado.dt_dia_vencto = DateTime.local().day;
    dadosAssociado.nu_vl_mensalidade = valorContrato;

    dadosAssociado.id_meiopagto_a = params.formaPagamento.gpPagto;
    dadosAssociado.dt_dataprimvenc = dataExpiracao.toFormat('yyyy/MM/dd');
    dadosAssociado.dt_inicio_vigencia = DateTime.local().toFormat('yyyy/MM/dd');
    dadosAssociado.cd_status = 0;
    dadosAssociado.st_mail = 0;

    dadosAssociado.nr_proposta = Math.random().toString();
    dadosAssociado.id_prodcomerc_a = formaPagamento.produtoComercial.id_prodcomerc;

    return dadosAssociado
  }
  
}
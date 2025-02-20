import { inject } from "@adonisjs/core/build/standalone";
import AssociadoService from "./AssociadoService";
import P4XService from "./P4XService";
import PagamentoCartaoOdontoCobService from "./PagamentoCartaoOdontoCobService";
import { addDays, format } from 'date-fns';
import SmsService from "./SmsService";
import PlanService from "./PlanService";
import UfService from "./UfService";




@inject()
export default class LinkCCService {
  constructor(
    private readonly associadoService: AssociadoService,
    private readonly p4xService: P4XService,
    private readonly cartaoOdontocobService: PagamentoCartaoOdontoCobService,
    private readonly smsService: SmsService,
    private readonly planoService: PlanService,
    private readonly ufService: UfService
  ) { }

  async processErrors() {
    const associados = await this.associadoService.findAssociadoByStatusandEmpresa('0', '15561');
    for (const associado of associados) {
        await this.proccesLinkCC(associado);
    }
}
  async ProcessAssociado(cpf: string) {
    const associado = await this.associadoService.findAssociadoByCpf(cpf);
    const link = await this.proccesLinkCC(associado);
    return link;
}

async proccesLinkCC(associado:any) {
    const body = await this.generateBody(associado);
        const link = await this.p4xService.geraLinkP4XCartaoCredito(body);
        const plano = await this.planoService.getPlanById(associado.id_prodcomerc_a);
        if(!link.dados.id){
            console.log('erro: ', link);
            throw new Error('Erro ao gerar link de pagamento');
        } else {
            //await this.associadoService.updateAssociadoIncompleto(associado, 1);
            const linkPgto = `https://p4x.com.br/pagamentos/?token=${link.dados.id}`;
            await this.cartaoOdontocobService.deletePagamentoLink(associado);
            await this.cartaoOdontocobService.savePagamentoLink(associado, link, body.dataExpiracao, linkPgto);
            await this.smsService.sendSmsUrlAdesao(associado.nu_dddCel+associado.nu_Celular, plano.nm_prodcomerc, associado.nm_associado, linkPgto);
            return linkPgto;
        }
}


  async generateBody(associado: any) {
    const dataExpiracao = format(addDays(new Date(), 7), "yyyy-MM-dd'T'00:00:00.000");
    //console.log('associado: ', associado);
    // Verifica se existe responsável financeiro, senão usa os dados do associado
    const responsavel = associado.responsavelFinanceiro[0] || associado;
    // Primeiro nome do responsável
    const primeiroNome = responsavel.nome ? responsavel.nome.split(' ')[0] : '';

    // Remove caracteres especiais do CPF e CEP
    const clearField = (field: any) => field ? field.replace(/\D/g, '') : '';
    const uf = await this.ufService.findUfById(associado.id_UF_a);

    //console.log('associado: ', uf);
    const body ={
        dataExpiracao,
        compraId: associado.nr_proposta,
        compradorId: associado.id_associado,
        descricao: "ADESÃO PLANO ODONTOLÓGICO - ODONTOGROUP",
        valor: associado.nu_vl_mensalidade,
        compradorNomeCompleto: responsavel.nm_RespFinanc,
        compradorDocumentoTipo: "PF",
        compradorDocumentoNumero: clearField(responsavel.nu_CPFRespFin || responsavel.nu_cpf),
        compradorEmail: responsavel.ds_emailRespFin || responsavel.ds_email,
        compradorTelefone:responsavel.nu_telRespFin ? `${responsavel.nu_dddRespFin}${responsavel.nu_telRespFin}` : `${responsavel.nu_dddCel}${responsavel.nu_Celular}`  ,
        compradorEnderecoLogradouro: responsavel.tx_EndLograd,
        compradorEnderecoNumero: responsavel.tx_EndNumero,
        compradorEnderecoComplemento: responsavel.tx_EndCompl,
        compradorEnderecoCep: clearField(responsavel.nu_CEP),
        compradorEnderecoCidade: responsavel.tx_EndCidade,
        compradorEnderecoEstado: uf.sigla,
        salvarCartao: true
    };
    return body;
  }
}
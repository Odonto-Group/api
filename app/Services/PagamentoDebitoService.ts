import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoDebito from "App/Models/TbPagamentoDebito";
import { DateTime } from "luxon";

export default class PagamentoDebitoService {

    savePagamentoDebito(params: any, associado: TbAssociado, valorContrato: number, dataExpiracao: string) {
        const pagamentoDebito = new TbPagamentoDebito
        pagamentoDebito.cd_associado_pd = associado.id_associado;
        pagamentoDebito.id_banco_pd = params.banco;
        pagamentoDebito.nu_agencia = params.agencia;
        pagamentoDebito.nu_conta = params.conta;
        pagamentoDebito.nu_valor = valorContrato;
        pagamentoDebito.ds_vencimento = dataExpiracao;
        pagamentoDebito.nu_OperacaoCEF = params.operacao || 0;
        pagamentoDebito.save();
    }
 
    async removePagamentoDebitoByIdAssociado(associado: TbAssociado) {
        await TbPagamentoDebito.query()
            .where('cd_associado_pd', associado.id_associado)
            .delete()
    }
  
}
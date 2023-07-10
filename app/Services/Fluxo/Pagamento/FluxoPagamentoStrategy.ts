import RetornoGeracaoPagamentoEmpresa from "App/interfaces/RetornoGeracaoPagamentoEmpresa.interface";
import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";

export default interface FluxoPagamentoStrategy {
    iniciarFluxoPagamento(params: any): Promise<RetornoGeracaoPagamentoIndividual | RetornoGeracaoPagamentoEmpresa>;
}

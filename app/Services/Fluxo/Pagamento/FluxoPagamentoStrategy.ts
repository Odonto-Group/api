import RetornoGeracaoPagamentoIndividual from "App/interfaces/RetornoGeracaoPagamentoIndividual.interface";

export default interface FluxoPagamentoStrategy {
    iniciarFluxoPagamento(params: any): Promise<RetornoGeracaoPagamentoIndividual>;
}

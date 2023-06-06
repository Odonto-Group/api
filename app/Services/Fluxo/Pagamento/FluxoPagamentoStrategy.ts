import RetornoGeracaoPagamento from "App/interfaces/RetornoGeracaoPagamento.interface";

export default interface FluxoPagamentoStrategy {
    iniciarFluxoPagamento(params: any): Promise<RetornoGeracaoPagamento>;
}

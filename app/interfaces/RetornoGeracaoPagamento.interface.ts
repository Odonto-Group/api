import { FormaPagamento } from "App/Enums/FormaPagamento";

export default interface RetornoGeracaoPagamento {
    linkPagamento: string,
    formaPagamento: FormaPagamento,
    agencia: string,
    conta: string
}
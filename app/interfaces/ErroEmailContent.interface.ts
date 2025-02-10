import { FormaPagamento } from "App/Enums/FormaPagamento";

export default interface ErroInclusaoEmailContent {
    NOMECLIENTE: string,
    CPF: string,
    EMAIL: string,
    TELEFONE: string,
    TIPO_PAGAMENTO: FormaPagamento
}
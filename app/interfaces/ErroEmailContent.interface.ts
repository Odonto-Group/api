import { FormaPagamento } from "App/Enums/FormaPagamento";

export default interface ErroEmailContent {
    NOMECLIENTE: string,
    TIPO_PAGAMENTO: FormaPagamento
}
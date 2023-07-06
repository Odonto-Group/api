import { FormaPagamento } from "App/Enums/FormaPagamento";

export default interface AdesaoEmailContent {
    NOMEPLANO: string,
    DATAVENCIMENTO: string,
    NOMECLIENTE: string,
    LINKPAGAMENTO: string,
    VALORPLANO: string,
    METODOPAGAMENTO: FormaPagamento
}
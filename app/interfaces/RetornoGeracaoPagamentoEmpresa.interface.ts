import { FormaPagamento } from "App/Enums/FormaPagamento";

export default interface RetornoGeracaoPagamentoEmpresa {
    linkProposta: string;
    nomeVendedor: string;
    telefone: string;
    quantidadeVidas: number;
    nomePlano: string;
    dataVencimento: string;
    linkPagamento: string,
    formaPagamento: FormaPagamento,
    agencia: string,
    conta: string,
    pix?: Pix,
    dataCadastro: string,
    numeroProposta: string,
    nome: string,
    email: string,
    idEmpresa: number,
    valorPagamento: string,
    pagamentoStatus: number,
    ddd: string
}
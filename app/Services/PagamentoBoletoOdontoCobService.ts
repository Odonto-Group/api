import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import TbAssociado from "App/Models/TbAssociado";
import TbPagamentoBoletoOdontoCob from "App/Models/TbPagamentoBoletoOdontoCob";
import { DateTime } from "luxon";


export default class PagamentoBoletoOdontoCobService {

    async savePagamentoEfetuadoOdontoCob(associado: TbAssociado, params: Record<string, any>, transaction: TransactionClientContract): Promise<TbPagamentoBoletoOdontoCob> {
        let pagamentoBoletoOdontoCob = await this.findByNossoNumero(associado.id_associado);

        pagamentoBoletoOdontoCob.dt_pagamento = params.data
        pagamentoBoletoOdontoCob.vl_valorpago = pagamentoBoletoOdontoCob.nu_valoremissao
        pagamentoBoletoOdontoCob.nu_statusboleto = 1

        pagamentoBoletoOdontoCob.useTransaction(transaction).save();

        return pagamentoBoletoOdontoCob;
    }

    async findByNossoNumero(nossoNumero: number) {
        return await TbPagamentoBoletoOdontoCob.query()
        .where('nossoNumero', nossoNumero)
        .first() || new TbPagamentoBoletoOdontoCob
    }

    async blAtivoFalseByCliente(idAssociado: string) {
        await TbPagamentoBoletoOdontoCob.query()
        .where('cd_cliente', idAssociado)
        .update({ blAtivo: false });
    }

    async removeByClient(client: number, transaction: TransactionClientContract) {
        await TbPagamentoBoletoOdontoCob.query()
        .where('cd_cliente', client)
        .useTransaction(transaction)
        .delete();
    }

    async savePagamento(idClient: number, geraOc: any, dataPrimeiroVencimento: string, urlBase: string, tipoPessoa: string, numeroProsposta: string, transaction: TransactionClientContract) {
        const pagamento = new TbPagamentoBoletoOdontoCob
        pagamento.cd_cliente                 = idClient; // PEGAR ID_ASSOCIADO OU ID_CDEMPRESA
        pagamento.dt_emissao                 = DateTime.now().toString()
        pagamento.id_banco_pbo               = 54;
        pagamento.nu_idboleto_odontocob      = geraOc.id;
        pagamento.nu_valoremissao            = geraOc.registro.titulo.valorNominal;
        pagamento.dt_vencimento              = dataPrimeiroVencimento; //
        pagamento.tx_linkboleto_odontocob    = urlBase + "v1.0/boletos/geraOc.id/imprimir";
        pagamento.nu_statusboleto            = 0;
        pagamento.nu_unico                   = 0;
        pagamento.tx_linhaDigitavel          = geraOc.registro.linhaDigitavel;
        pagamento.tx_codigoBarra             = geraOc.registro.codigoBarra;
        pagamento.tipo_cliente               = tipoPessoa;
        pagamento.nossoNumero                = geraOc.registro.titulo.nossoNumero;
        pagamento.nr_proposta                = numeroProsposta; //PEGAR N° PROPOSTA EMPRESA
        pagamento.blAtivo                    = true;
        await pagamento.useTransaction(transaction).save();
    }
}
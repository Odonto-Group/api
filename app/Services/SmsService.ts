import Env from '@ioc:Adonis/Core/Env'
import TbAssociado from 'App/Models/TbAssociado';
import TbResponsavelFinanceiro from 'App/Models/TbResponsavelFinanceiro';
import { default as axios } from 'axios';
import fetch from 'node-fetch';

export default class SmsService {

  private smsDefaultTeste = Env.get('SMS_ENVIO_DEFAULT')

  async sendSmsUrlValidacaoCodigo(number: string) {
    const code = Math.floor(Math.random() * 9000) + 1000;

    const payload = {
      body: `Seu código de verificação é: ${code}`,
      to: this.smsDefaultTeste || number,
    };

    try {
      await fetch(Env.get('SMS_PROVIDER_URL'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Env.get('SMS_PROVIDER_TOKEN')}`,
        },
        body: JSON.stringify(payload),
      });

      return code;
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      throw new Error('Erro ao enviar SMS');
    }
  };

  async sendSmsUrlAdesao(number: string, plano: string, nomeCliente: string, linkPagamento: string) {

    const payload = {
      messages: [{
      from: 'OdontoGroup',
      text: `Prezado(a) ${nomeCliente},
      Gostaríamos de informar que sua adesão do plano ${plano}
      está quase concluída, segue o link do pagamento: ${linkPagamento}.
      OdontoGroup Sistema de Saúde`,
      destinations:[{
      to:"55" + (this.smsDefaultTeste || number),
      }],
    }]};

    try {
      const url = Env.get('SMS_PROVIDER_URL');
      const Token = Env.get('SMS_PROVIDER_TOKEN');
      const teste = await axios.post(url, JSON.stringify(payload),{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `App ${Token}`,
          },
      });
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      throw new Error('Erro ao enviar SMS');
    }
  };

  async enviaSmsResponsavelAdesao(responsavelFinanceiroBanco: TbResponsavelFinanceiro, associado: TbAssociado, plano: string, linkPagamento: string) {
    if (responsavelFinanceiroBanco) {
      await this.sendSmsUrlAdesao(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin, associado.nm_associado, plano, linkPagamento)
    } else {
      await this.sendSmsUrlAdesao(associado.nu_dddCel + associado.nu_Celular, associado.nm_associado, plano, linkPagamento)
    }
  }

  async sendSmsUrlPagamentoExecutado(number: string, nomeCliente: string) {

    const payload = {
      body: `Seja bem-vindo(a) à OdontoGroup ${nomeCliente}!
      Pagamentos com cartão de crédito, débito em conta
      e boleto bancário podem levar até 72 horas úteis
      para serem confirmados no sistema. Já para pagamento
      em desconto em folha, o prazo é de até 7 dias úteis.
      
      A partir de agora, você terá acesso a uma ampla rede
      de dentistas e serviços odontológicos de qualidade,
      além de um atendimento personalizado e exclusivo para
      os nossos clientes. Esperamos que esteja tão
      empolgado(a) quanto nós em iniciar essa parceria.
      
      OdontoGroup Sistema de Saúde`,
      to: this.smsDefaultTeste || number,
    };

    try {
      await fetch(Env.get('SMS_PROVIDER_URL'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Env.get('SMS_PROVIDER_TOKEN')}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      throw new Error('Erro ao enviar SMS');
    }
  };

  async enviaSmsResponsavelPagamentoEfetuado(responsavelFinanceiroBanco: TbResponsavelFinanceiro, associado: TbAssociado) {
    if (responsavelFinanceiroBanco) {
      await this.sendSmsUrlPagamentoExecutado(responsavelFinanceiroBanco.nu_dddRespFin + responsavelFinanceiroBanco.nu_telRespFin, associado.nm_associado)
    } else {
      await this.sendSmsUrlPagamentoExecutado(associado.nu_dddCel + associado.nu_Celular, associado.nm_associado)
    }
  }
}

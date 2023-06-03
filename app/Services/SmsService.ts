import Env from '@ioc:Adonis/Core/Env'
import fetch from 'node-fetch';

export default class SmsService {
  sendSmsUrl = async (number: string) => {
    const code = Math.floor(Math.random() * 9000) + 1000;

    const payload = {
      body: `Seu código de verificação é: ${code}`,
      to: '+5535998999220',
      //to: number,
    };

    try {
      const response = await fetch(Env.get('SMS_PROVIDER_URL'), {
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
}

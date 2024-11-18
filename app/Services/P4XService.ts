import { default as axios } from 'axios';
import { inject } from '@adonisjs/core/build/standalone';
import Env from '@ioc:Adonis/Core/Env'

@inject()
export default class P4XService {
    private usuario = Env.get('USUARIO_P4X')
    private senha = Env.get('SENHA_P4X')
    private urlBaseP4x = Env.get('URL_BASE_P4X')
    
    constructor(
    ){}

    async geraPagamentoP4XBoleto(body: any) {
        try {
            const token = await this.geraToken();

            const response = await axios.post(`${this.urlBaseP4x}/boletos`, body, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                return response.data;
            } else {
                return false;
            }
        } catch (erro) {
            console.log('erro: ', erro);
            return false
        }
    }

    async geraPagamentoP4XCartaoCredito(body: any) {
        try {
            const token = await this.geraToken();

            const linkPagamentoCartao = `${this.urlBaseP4x}/pagamentos/cartaocredito`
            console.log('url: ', linkPagamentoCartao);
            
            const response = await axios.post(linkPagamentoCartao, body, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                return response.data;
            } else {
                console.log('erro response: ', response);
                return false;
            }
        } catch (erro) {
            //console.log('deu erro catch:', erro);            
            return false
        }
        
    }
    async cancelaPagamentoP4XCartaoCredito(body: any) {
        try {
            const token = await this.geraToken();

            const linkPagamentoCartao = `${this.urlBaseP4x}/pagamentos/cartaocredito/${body.pagamentoId}/cancelar`
            
            const response = await axios.post(linkPagamentoCartao, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                return response.data;
            } else {
                console.log('erro response: ', response);
                return false;
            }
        } catch (erro) {
            //console.log('deu erro catch:', erro);            
            return false
        }
        
    }

    async  geraToken() {
        const body = {
            usuario: this.usuario,
            senha: this.senha
        };

        try {
            const response = await axios.post(`${this.urlBaseP4x}/conta/token`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
            });

            if (response.status === 200) {
                const result = response.data;
                return result.token;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

}
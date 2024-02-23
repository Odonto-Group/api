import { default as axios } from 'axios';
import { inject } from '@adonisjs/core/build/standalone';
import Env from '@ioc:Adonis/Core/Env'

@inject()
export default class P4XService {

    private s4eInclude = Env.get('S4E_URL_INCLUSAO')
    private s4eToken = Env.get('SE4_TOKEN')
    
    constructor(
    ){}

    async includeAssociado(body: any) {
        try {

            const response = await axios.post(`${this.s4eInclude}`, body, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.s4eToken}`,
                },
            });
    
            if (response.status === 200) {
                return response.data;
            } else {
                return false;
            }
        } catch (erro) {
            return false
        }
    }
}
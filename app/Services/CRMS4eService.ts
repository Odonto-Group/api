import { inject } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import S4EService from './S4EService'

@inject()
export default class CRMS4eService {
  private s4eTokenV1 = Env.get('S4E_TOKEN_V1')
  constructor(
    private readonly S4EService: S4EService
  ) {}

  async includeCRM(descricao: string, descricaoOcorrencia: string, usuario: number, motivodetalhado: number, tipoUsuario: number, tipoSolicitante: number, solicitante: number ) {
    try {
      const bodyCrm = {
            token: this.s4eTokenV1,
            motivoDetalhadoId: motivodetalhado,
            descricao: descricao,
            tipoUsuario: tipoUsuario,
            usuarioId: usuario,
            tipoSolicitanteId: tipoSolicitante,
            solicitanteId: solicitante,
            arquivo: "",
            extensao: "",
            mostraPortal: 1,
            situacaoChamado: 1
        }
        const newCrm = await this.S4EService.includeCrm(bodyCrm);
        console.log('Crm criado: ', newCrm);
        if (newCrm.codigo == 1) {
            const bodyOcorrencia = {
              token: this.s4eTokenV1,
              ocorrencia:{
                  protocolo: newCrm?.dados?.protocolo,
                  usuario: usuario,
                  tipoUsuario: tipoUsuario,
                  descricao: descricaoOcorrencia,
                  status: 1,
                  arquivo: ""
              }
            }
            const newOcorrencia = await this.S4EService.includeOcorrencia(bodyOcorrencia);
            console.log('nova ocorrencia retorno: ', newOcorrencia);
            if (newOcorrencia.codigo == 3){
                const mensagem = `erro ao criar novo Ocorrencia no Crm: ${newCrm?.dados?.protocolo} com os dados do Associado, Erro: ${newOcorrencia.mensagem}`;
                throw new Error(mensagem);
            }
        } else {
            throw new Error('erro ao criar novo Crm com os dados do Associado, Erro: ' + newCrm.mensagem);
        }
      const retorno = {
        protocolo: newCrm?.dados?.protocolo
      }
      return retorno;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

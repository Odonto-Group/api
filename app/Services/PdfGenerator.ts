import { inject } from '@adonisjs/core/build/standalone';
import ApiV3Service from './ApiV3';
import AssociadoService from './AssociadoService';
import FileService from './FileService';
import ProdutoComercialService from './ProdutoComercialService';
import S4EService from './S4EService';

@inject()
export class MailSenderService {
    constructor(
        private readonly produtoService: ProdutoComercialService,
        private readonly S4eService: S4EService,
        private fileService: FileService,
        private readonly associadoService: AssociadoService
      ) {}
    async propostaGenerate(cpf: string){
        try{
          const associado = await this.S4eService.getAssociadoByCpfProposta(cpf);      
          const titular = associado.dados.find(x => x.CD_GRAU_PARENTESCO == 1);
          const associadoVO = await this.associadoService.findAssociadoByCpf(cpf);
          if(titular){            
            
           
            return true;
          } else {
            throw new Error('não foi possivel encontrar o associado');
          }
        } catch(error) {
          throw new Error('não foi possivel enviar o email' + error.message);
        }
    }

    async generatePdf(responsavelFinanceiro, titular, dependentes, formaPagamento, vendedor){
        try{

        }
        catch(error){
            throw new Error('Erro ao gerar PDF: ' + error.message);
        }
    }
}
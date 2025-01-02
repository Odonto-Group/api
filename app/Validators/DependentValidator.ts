import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class DependentValidator {
  public schema = schema.create({
    token: schema.string(),
    dados: schema.object().members({
      parceiro: schema.object().members({
        codigo: schema.number(),
        adesionista: schema.number(),
      }),
      responsavelFinanceiro: schema.object().members({
        codigo: schema.number(),
        dataAssinaturaContrato: schema.string({}, [
          rules.regex(/^\d{4}-\d{2}-\d{2}$/), // Validação para formato de data YYYY-MM-DD
        ]),
      }),
      dependente: schema.array.optional().members(
        schema.object().members({
          tipo: schema.number(),
          nome: schema.string(),
          cpf: schema.string({}, [
            rules.minLength(11),
            rules.regex(/^\d{11}$/), // Apenas dígitos
          ]),
          sexo: schema.number(),
          plano: schema.number(),
          planoValor: schema.string({}, [
            rules.regex(/^\d+(\.\d{1,2})?$/), // Validação para valores monetários
          ]),
          nomeMae: schema.string(),
          numeroProposta: schema.string(),
          carenciaAtendimento: schema.number.optional(),
          rcaId: schema.number.optional(),
          cd_orientacao_sexual: schema.number.optional(),
          OutraOrientacaoSexual: schema.string.optional(),
          cd_ident_genero: schema.number.optional(),
          OutraIdentidadeGenero: schema.string.optional(),
          idExterno: schema.string.optional(),
          MMYYYY1Pagamento: schema.string({}, [
            rules.regex(/^\d{6}$/), // Formato MMYYYY
          ]),
          numeroCarteira: schema.string.optional(),
          observacaoUsuario: schema.string.optional(),
          dataNascimento: schema.string({}, [
            rules.regex(/^\d{4}-\d{2}-\d{2}$/), // Validação para formato de data YYYY-MM-DD
          ]),
          funcionarioCadastro: schema.number.optional(),
          dataCadastroLoteContrato: schema.string.optional(),
        })
      ),
      contatoDependente: schema.array.optional().members(
        schema.object().members({
          tipo: schema.number(),
          dado: schema.string({}, [
            rules.regex(/^\d{10,11}$/), // Telefone no formato 10 ou 11 dígitos
          ]),
        })
      ),
    }),
  })
}

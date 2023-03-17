import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TbLeadStatus from 'App/Models/TbLeadStatus'

export default class extends BaseSeeder {
  public async run () {
    await TbLeadStatus.createMany([
      {
        descricao: 'Atendeu',
      },
      {
        descricao: 'Não Atendeu',
      },


      {
        descricao: 'Retornar ligação',
      },
      {
        descricao: 'Dentista Particular',
      },
      {
        descricao: 'Tratamento recente',
      },
      {
        descricao: 'SAC',
      },
      {
        descricao: 'Problemas Financeiros',
      },
      {
        descricao: 'Efetivado',
      },
      {
        descricao: 'Aguardando Formalização',
      },
      {
        descricao: 'Em negociação',
      },
      {
        descricao: 'Já tem plano',
      },
      {
        descricao: 'Não tem interesse',
      },
      {
        descricao: 'Cidade sem cobertura (mencionar a cidade)',
      },
      {
        descricao: 'Engano',
      },
      {
        descricao: 'Outros',
      },

      
      {
        descricao: 'Telefone inválido',
      },
      {
        descricao: 'Telefone Ocupado',
      },
      {
        descricao: 'Caixa Postal',
      },
    ])
  }
}

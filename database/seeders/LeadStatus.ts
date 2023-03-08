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
        descricao: 'Convertido',
      },
      {
        descricao: 'Não Convertido',
      },
      {
        descricao: 'Telefone não existe',
      },
      {
        descricao: 'Telefone Errado',
      },
      {
        descricao: 'Já tem plano',
      },
      {
        descricao: 'Dentista Particular',
      },
      {
        descricao: 'Acabou um tratamento recente',
      }
    ])
  }
}

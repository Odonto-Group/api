import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_leads'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('cpf').nullable()
      table.date('data_nascimento').nullable()
      table.string('cep').nullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('cpf')
      table.dropColumn('data_nascimento')
      table.dropColumn('cep')
    })
  }
}

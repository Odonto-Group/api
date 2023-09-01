import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pf_maceio_dependentes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome_dependente')
      table.string('nu_cpf_dependente')
      table.date('dt_nascimento')
      table.integer('cd_associado_pf_maceio').unsigned().references('id').inTable('tb_pf_maceio_associados').onDelete('CASCADE')
      table.integer('id_parentesco_d').references('id_parentesco').inTable('tb_parentesco')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

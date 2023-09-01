import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pf_maceio_associados'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome_associado')
      table.string('nu_matricula')
      table.string('nu_cpf')
      table.date('dt_nascimento')
      table.string('email')
      table.string('nu_ddd_celular')
      table.string('nu_celular')
      table.string('nm_mae')
      table.integer('cd_termo_autorizacao') 
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

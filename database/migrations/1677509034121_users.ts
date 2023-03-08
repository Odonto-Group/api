import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('cpf', 11).notNullable();
      table.renameColumn('remember_token','remember_me_token')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

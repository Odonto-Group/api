import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_log_leads_status_sec'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('id_status_primario').unsigned().references('id').inTable('tb_log_leads_status_prim').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['id_status_primario'])
      table.dropColumn('id_status_primario')
    })
  }
}
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_leads'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('origem').notNullable().alter()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.tinyint('origem').notNullable().alter()
    })
  }
}

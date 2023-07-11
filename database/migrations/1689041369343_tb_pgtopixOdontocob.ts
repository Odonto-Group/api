import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pgtopixOdontocob'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('dt_vencimento')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('dt_vencimento')
    })
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pgtopix'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("copia_cola")
      table.dropColumn("qr_code")
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.string('copia_cola')
      table.string('qr_code')
    })
  }
}

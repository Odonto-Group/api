import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_categoria'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('nu_vidas_min', 3).nullable()
      table.integer('nu_vidas_max', 3).nullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('nu_vidas_min');
      table.dropColumn('nu_vidas_max');
    })
  }
}

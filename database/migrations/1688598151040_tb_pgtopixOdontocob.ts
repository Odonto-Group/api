import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pgtopixOdontocob'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('cd_associado').nullable().alter();
      table.integer('cd_empresa').references('id_cdempresa').inTable('tb_empresa').onDelete('CASCADE').nullable().after('cd_associado');
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.integer('cd_associado').notNullable().alter();
      table.dropColumn('cd_empresa');
    })
  }
}

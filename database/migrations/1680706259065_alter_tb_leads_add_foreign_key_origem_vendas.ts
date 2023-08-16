import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_leads'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('origem').references('id_origemVenda').inTable('tb_origemVenda').onDelete('CASCADE').alter();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['origem']);
      table.integer('origem').alter();
    });
  }
}

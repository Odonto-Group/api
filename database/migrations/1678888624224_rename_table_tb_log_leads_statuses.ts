import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_log_leads_status'

  public async up () {
    this.schema.renameTable(this.tableName, 'tb_log_leads_status_sec')
  }

  public async down () {
    this.schema.renameTable('tb_log_leads_status_sec', this.tableName)
  }
}
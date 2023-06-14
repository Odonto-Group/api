import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pgtopixOdontocob'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cd_associado').references('id_associado').inTable('tb_associado').onDelete('CASCADE')
      table.dateTime('dt_cadastro')
      table.dateTime('dt_pagamento')
      table.decimal("valor_pago",10,2)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

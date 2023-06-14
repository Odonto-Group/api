import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tb_pgtopix'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cd_associado').references('id_associado').inTable('tb_associado').onDelete('CASCADE').notNullable()
      table.string("id_pix_odontocob")
      table.dateTime('dt_cadastro')
      table.dateTime('dt_vencimento')
      table.decimal("valor",10,2)
      table.dateTime('dt_pagamento')
      table.string("copia_cola")
      table.string("qr_code")
      table.boolean("ativo").defaultTo(1)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

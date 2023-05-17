import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm"

export default class TbTipoPreco extends BaseModel {
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public tx_descricao: string
}
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm"

export default class TbCategoria extends BaseModel {
    public static table = 'tb_categoria'

    @column({ isPrimary: true })
    public id_categoria: number
  
    @column()
    public tx_descricao: string
}
import TbVendedor from "App/Models/TbVendedor";

export default class VendedorService {

    async buscarVendedor(idVendedor: number): Promise<TbVendedor> {
        return await TbVendedor.query()
            .where('tb_vendedor.id_vendedor', idVendedor)
            .first() || new TbVendedor;
    }
}
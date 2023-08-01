import TbCarenciaProduto from "App/Models/TbCarenciaProduto";

export default class CarenciaProdutoService {
    
    async buscarCarencia(idProduto: number) {
        return await TbCarenciaProduto.query()
        .preload('carencia')
        .leftJoin('tb_carencia', 'tb_carenciaprod.id_carencia_pr', '=', 'tb_carencia.id_carencia')
        .where('tb_carenciaprod.id_prodcomerc_pr', idProduto)
    }
}
import TbEmpresa from "App/Models/TbEmpresa";

export default class EmpresaService {
    async buscarEmpresa(cnpj: string) {
        return await TbEmpresa.query()
            .where('nu_cnpj', cnpj)
            .first() || new TbEmpresa;
    }
}
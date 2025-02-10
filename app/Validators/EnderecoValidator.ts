import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class EnderecoValidator {
  public schema = schema.create({
    IdTipoLogradouro: schema.number(),
    Logradouro: schema.string(),
    IdBairro: schema.number(),
    Bairro: schema.string(),
    IdMunicipio: schema.number(),
    Municipio: schema.string(),
    IdUf: schema.number(),
    Uf: schema.string(),
    CodigoMunicipioIBGE: schema.string(),
    IdCentroCusto: schema.number(),
  })
}
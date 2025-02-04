"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const path = __importStar(require("path"));
const fsExtra = __importStar(require("fs-extra"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
let FileService = class FileService {
    constructor() {
        this.linkEnvContrato = Env_1.default.get('LINK_CONTRATO');
        this.linkArquivoIndividualDependente = Env_1.default.get('LINK_ARQUIVO_INDIVIDUAL_DEPENDENTE');
        this.nomeArquivoIndividualDependente = Env_1.default.get('COMPROVANTE_VINCULO_INDIVIDUAL_DEPENDENTE_ARQUIVO');
        this.linkArquivoEmpresaDependente = Env_1.default.get('LINK_ARQUIVO_EMPRESA_DEPENDENTE');
        this.nomeArquivoEmpresaDependente = Env_1.default.get('COMPROVANTE_VINCULO_EMPRESA_DEPENDENTE_ARQUIVO');
    }
    buscarContrato(idContrato) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.linkEnvContrato.replace("{idContrato}", idContrato);
            try {
                const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
                const file = Buffer.from(response.data, 'binary');
                return file;
            }
            catch (error) {
                console.log("Arquivo não encontrado.");
            }
        });
    }
    salvarArquivoIndividualDependente(idDependente, arquivo, idAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (arquivo && arquivo.tmpPath) {
                    const nomeArquivo = this.nomeArquivoIndividualDependente.replace("idDependente", idDependente.toString());
                    const caminhoArquivo = this.linkArquivoIndividualDependente.replace("idAssociado", idAssociado.toString());
                    yield Drive_1.default.put(caminhoArquivo + nomeArquivo, "teste");
                    const url = path.join(caminhoArquivo, nomeArquivo);
                    yield fsExtra.move(arquivo.tmpPath, url);
                }
            }
            catch (ex) {
                console.log();
            }
        });
    }
    salvarArquivoEmpresaDependente(idDependente, arquivo, idAssociado) {
        return __awaiter(this, void 0, void 0, function* () {
            const nomeArquivo = this.nomeArquivoEmpresaDependente.replace("idDependente", idDependente);
            const caminhoArquivo = this.linkArquivoEmpresaDependente.replace("idAssociado", idAssociado);
            yield fsExtra.ensureDir(caminhoArquivo);
            const url = path.join(caminhoArquivo, nomeArquivo);
            yield fsExtra.move(arquivo.path, url);
            return url;
        });
    }
};
FileService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [])
], FileService);
exports.default = FileService;
//# sourceMappingURL=FileService.js.map
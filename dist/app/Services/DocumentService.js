"use strict";
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
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const promises_1 = __importDefault(require("fs/promises"));
class DocumentService {
    uploadImage(file, id, destino = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const ext = file.extname;
            const filename = `${Date.now()}.${ext}`;
            let path = `files/vendas/${id}/${filename}`;
            if (destino) {
                switch (destino) {
                    case 'servidor':
                        path = `files/vendas/${id}/contracheque/${filename}`;
                        break;
                    case 'dependente':
                        path = `files/vendas/${id}/dependentes/${filename}`;
                        break;
                    default:
                        path = `files/vendas/${id}/${filename}`;
                        break;
                }
            }
            const fileContents = yield promises_1.default.readFile(file.tmpPath, { encoding: 'base64' });
            yield Drive_1.default.put(path, fileContents, { contentEncoding: 'base64' });
        });
    }
}
exports.default = DocumentService;
//# sourceMappingURL=DocumentService.js.map
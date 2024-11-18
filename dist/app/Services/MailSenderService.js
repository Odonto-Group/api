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
exports.MailSenderService = void 0;
const mailerConfig_1 = __importDefault(global[Symbol.for('ioc.use')]("Config/mailerConfig"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const ErroAoEnviarEmailException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/ErroAoEnviarEmailException"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const FileService_1 = __importDefault(require("./FileService"));
const standalone_1 = require("@adonisjs/core/build/standalone");
let MailSenderService = class MailSenderService {
    constructor(fileService) {
        this.fileService = fileService;
        this.emailSuporteOdontoGroup = Env_1.default.get('EMAIL_ODONTO_GROUP_SUPORTE');
        this.emailDefaultTeste = Env_1.default.get('EMAIL_ENVIO_DEFAULT');
        this.emailOuvidoria = Env_1.default.get('EMAIL_ODONTO_OUV');
        this.fromEmail = Env_1.default.get('MAIL_FROM');
        this.bccEmail = Env_1.default.get('MAIL_BCC');
    }
    sendEmailPagamentoAprovado(to, subject, idContrato, contentView) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'pagamento', `PagamentoTemplate.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `capa-pessoas.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `instagram-logo.png`));
            const apple = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `apple-logo.png`));
            const android = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `android-logo.png`));
            const telefone = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'pagamento', `telefone.png`));
            const file = yield this.fileService.buscarContrato(idContrato);
            if (!file) {
                const planoContent = {
                    CONTRATOID: idContrato
                };
                yield this.sendEmailErroContratoNaoEncontrado(this.emailDefaultTeste || this.emailSuporteOdontoGroup, 'Erro buscar contrato OdontoGroup.', planoContent);
            }
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in contentView) {
                const value = contentView[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const mailOptions = {
                from: Env_1.default.get('MAIL_FROM'),
                bcc: Env_1.default.get('MAIL_BCC'),
                to,
                subject,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    },
                    {
                        filename: 'apple-logo.png',
                        content: apple,
                        cid: 'apple'
                    },
                    {
                        filename: 'android-logo.png',
                        content: android,
                        cid: 'android'
                    },
                    {
                        filename: 'telefone.png',
                        content: telefone,
                        cid: 'telefone'
                    },
                    {
                        filename: 'contrato.pdf',
                        content: file
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
    sendEmailAdesaoBoleto(to, subject, contentView) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `AdesaoTemplate.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `capa-mulher.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'boleto', `instagram-logo.png`));
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in contentView) {
                const value = contentView[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const mailOptions = {
                from: Env_1.default.get('MAIL_FROM'),
                bcc: Env_1.default.get('MAIL_BCC'),
                to,
                subject,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
    ;
    sendEmailAdesaoSemLinkPagamento(to, subject, contentView) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `AdesaoTemplate.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `capa-mulher.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'semlinkpagamento', `instagram-logo.png`));
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in contentView) {
                const value = contentView[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const mailOptions = {
                from: Env_1.default.get('MAIL_FROM'),
                bcc: Env_1.default.get('MAIL_BCC'),
                to,
                subject,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
    ;
    sendEmailErro(to, subject, contentView) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `ErroPagamentoSuporte.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `capa-mulher.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'pagamento', `instagram-logo.png`));
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in contentView) {
                const value = contentView[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const mailOptions = {
                from: Env_1.default.get('MAIL_FROM'),
                bcc: Env_1.default.get('MAIL_BCC'),
                to,
                subject,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
    ;
    sendEmailErroContratoNaoEncontrado(to, subject, contentView) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `ContratoNaoEncontrado.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `capa-mulher.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'erro', 'contrato', `instagram-logo.png`));
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in contentView) {
                const value = contentView[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const mailOptions = {
                from: Env_1.default.get('MAIL_FROM'),
                bcc: Env_1.default.get('MAIL_BCC'),
                to,
                subject,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
    ;
    sendEmailEmpresaPlano(to, subject, contentView) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `EmpresaPlanoTemplate.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `capa-mulher.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `instagram-logo.png`));
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in contentView) {
                const value = contentView[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const mailOptions = {
                from: Env_1.default.get('MAIL_FROM'),
                bcc: Env_1.default.get('MAIL_BCC'),
                to,
                subject,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
    sendOuvidoria(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const htmlFilePath = path.join(__dirname, '..', '..', 'email', 'adesao', 'ouvidoria', `OuvidoriaTemplate.html`);
            const capa = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `capa-mulher.png`));
            const linkedin = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `linkedin-logo.png`));
            const ans = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `ANS.png`));
            const odontoGroup = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `odonto-group.png`));
            const instagram = yield fs.promises.readFile(path.join(__dirname, '..', '..', 'email', 'adesao', 'empresa', `instagram-logo.png`));
            const htmlContent = yield fs.promises.readFile(htmlFilePath, 'utf8');
            let finalHtmlContent = htmlContent;
            for (const key in data) {
                const value = data[key];
                finalHtmlContent = finalHtmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
            const to = this.emailOuvidoria;
            const mailOptions = {
                from: this.fromEmail,
                bcc: this.bccEmail,
                to,
                subject: `Ouvidoria - ${(_a = data.subject) !== null && _a !== void 0 ? _a : data.name}`,
                html: finalHtmlContent,
                attachments: [
                    {
                        filename: 'vista-lateral-da-mulher-feliz-gengibre-beleza-vestido-1.png',
                        content: capa,
                        cid: 'capa'
                    },
                    {
                        filename: 'linkedin-logo.png',
                        content: linkedin,
                        cid: 'linkedin'
                    },
                    {
                        filename: 'instagram-logo.png',
                        content: instagram,
                        cid: 'instagram'
                    },
                    {
                        filename: 'odonto-group.png',
                        content: odontoGroup,
                        cid: 'odontoGroup'
                    },
                    {
                        filename: 'ANS.png',
                        content: ans,
                        cid: 'ans'
                    }
                ]
            };
            try {
                yield mailerConfig_1.default.sendMail(mailOptions);
            }
            catch (error) {
                throw new ErroAoEnviarEmailException_1.default(to);
            }
        });
    }
};
MailSenderService = __decorate([
    (0, standalone_1.inject)(),
    __metadata("design:paramtypes", [FileService_1.default])
], MailSenderService);
exports.MailSenderService = MailSenderService;
//# sourceMappingURL=MailSenderService.js.map
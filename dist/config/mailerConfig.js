"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
class MailerConfig {
    constructor() {
        this.transporter = this.buildTransporter();
    }
    buildTransporter() {
        return nodemailer_1.default.createTransport({
            host: Env_1.default.get('MAIL_HOST'),
            port: Env_1.default.get('MAIL_PORT'),
            secure: false,
            auth: {
                user: Env_1.default.get('MAIL_USERNAME'),
                pass: Env_1.default.get('MAIL_PASSWORD'),
            },
        });
    }
    getTransporter() {
        return this.transporter;
    }
}
exports.default = new MailerConfig().getTransporter();
//# sourceMappingURL=mailerConfig.js.map
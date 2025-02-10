"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
function gerarNumeroProposta() {
    const now = luxon_1.DateTime.local();
    const year = now.toFormat('yyyy');
    const month = now.toFormat('MM');
    const timestamp = Math.floor(now.toMillis() / 1000);
    return `${year}${month}${timestamp}`;
}
exports.default = gerarNumeroProposta;
//# sourceMappingURL=Proposta.js.map
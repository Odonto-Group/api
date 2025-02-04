"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatNumberBrValue(value) {
    let formatting_options = {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    };
    let brazilString = new Intl.NumberFormat('pt-br', formatting_options);
    return brazilString.format(value);
}
exports.default = formatNumberBrValue;
//# sourceMappingURL=FormatNumber.js.map
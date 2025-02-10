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
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'tb_pgtopixOdontocob';
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.schema.alterTable(this.tableName, (table) => {
                table.dateTime('dt_vencimento');
            });
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.schema.table(this.tableName, (table) => {
                table.dropColumn('dt_vencimento');
            });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=1689041369343_tb_pgtopixOdontocob.js.map
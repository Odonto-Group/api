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
        this.tableName = 'tb_log_leads_status_sec';
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.schema.table(this.tableName, (table) => {
                table.integer('id_status_primario').unsigned().references('id').inTable('tb_log_leads_status_prim').onDelete('CASCADE');
            });
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.schema.table(this.tableName, (table) => {
                table.dropForeign(['id_status_primario']);
                table.dropColumn('id_status_primario');
            });
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=1678990837064_alter_table_tb_log_leads_status_secundarios.js.map
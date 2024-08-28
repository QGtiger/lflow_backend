"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresService = void 0;
const common_1 = require("@nestjs/common");
let PostgresService = class PostgresService {
    async create(table, values) {
        const columns = Object.keys(values).join(', ');
        const placeholders = Object.keys(values)
            .map((_, index) => `$${index + 1}`)
            .join(', ');
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
        return this.query(query, Object.values(values));
    }
    async query(query, values = []) {
        return this.postgresClient.query(query, values);
    }
    async findOne(table, where) {
        const columns = Object.keys(where).join(' AND ');
        const placeholders = Object.keys(where)
            .map((_, index) => `$${index + 1}`)
            .join(' AND ');
        const query = `SELECT * FROM ${table} WHERE ${columns} = ${placeholders}`;
        const { rows } = await this.query(query, Object.values(where));
        return rows[0];
    }
};
exports.PostgresService = PostgresService;
__decorate([
    (0, common_1.Inject)('POSTGRES_CLIENT'),
    __metadata("design:type", Function)
], PostgresService.prototype, "postgresClient", void 0);
exports.PostgresService = PostgresService = __decorate([
    (0, common_1.Injectable)()
], PostgresService);
//# sourceMappingURL=postgres.service.js.map
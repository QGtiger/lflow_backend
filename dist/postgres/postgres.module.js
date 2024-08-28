"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresModule = void 0;
const common_1 = require("@nestjs/common");
const postgres_service_1 = require("./postgres.service");
const pg_1 = require("pg");
const config_1 = require("@nestjs/config");
let PostgresModule = class PostgresModule {
};
exports.PostgresModule = PostgresModule;
exports.PostgresModule = PostgresModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            postgres_service_1.PostgresService,
            {
                provide: 'POSTGRES_CLIENT',
                async useFactory(configService) {
                    console.log(configService.get('POSTGRES_URL'));
                    const client = new pg_1.Client({
                        connectionString: configService.get('POSTGRES_URL'),
                    });
                    await client.connect();
                    console.log('Connected to Postgres database and created users table');
                    await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,    -- 自增主键
            username VARCHAR(255) UNIQUE NOT NULL,  -- 用户名，唯一且非空
            password VARCHAR(255) NOT NULL,  -- 密码，非空
            email VARCHAR(255) UNIQUE NOT NULL,  -- 电子邮件，唯一且非空
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- 创建时间，默认为当前时间
          );
        `);
                    return client;
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [postgres_service_1.PostgresService],
    })
], PostgresModule);
//# sourceMappingURL=postgres.module.js.map
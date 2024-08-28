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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const postgres_service_1 = require("../postgres/postgres.service");
let UserService = class UserService {
    async login(loginUserDto) {
        const foundUser = await this.postgresService.findOne('users', {
            username: loginUserDto.username,
        });
        console.log(foundUser);
        if (!foundUser) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.BAD_REQUEST);
        }
        if (foundUser.password !== loginUserDto.password) {
            throw new common_1.HttpException('Password is incorrect', common_1.HttpStatus.BAD_REQUEST);
        }
        return loginUserDto;
    }
    async register(registerUserDto) {
        const newUser = await this.postgresService.create('users', registerUserDto);
        return newUser;
    }
};
exports.UserService = UserService;
__decorate([
    (0, common_1.Inject)(postgres_service_1.PostgresService),
    __metadata("design:type", postgres_service_1.PostgresService)
], UserService.prototype, "postgresService", void 0);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map
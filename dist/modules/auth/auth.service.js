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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const admins_service_1 = require("../admins/admins.service");
let AuthService = class AuthService {
    constructor(adminsService, jwtService) {
        this.adminsService = adminsService;
        this.jwtService = jwtService;
    }
    async login(email, password) {
        const admin = await this.adminsService.findByEmailWithPassword(email);
        if (!admin || !admin.isActive) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatches = await bcrypt.compare(password, admin.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await this.adminsService.recordLogin(admin.id);
        const accessToken = await this.jwtService.signAsync({
            sub: admin.id,
            email: admin.email,
            role: admin.role,
        });
        return {
            accessToken,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                avatar: admin.avatar,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admins_service_1.AdminsService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL ?? '',
    jwt: {
        secret: process.env.JWT_SECRET ?? '',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
    upload: {
        dir: process.env.UPLOAD_DIR ?? 'uploads',
        maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '10', 10),
    },
});
//# sourceMappingURL=configuration.js.map
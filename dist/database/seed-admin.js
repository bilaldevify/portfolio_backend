"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const readline = require("readline");
const client_1 = require("@prisma/client");
dotenv.config();
function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('Missing DATABASE_URL in your .env file.');
        process.exit(1);
    }
    const prisma = new client_1.PrismaClient();
    const existingCount = await prisma.admin.count();
    if (existingCount > 0) {
        console.log(`There are already ${existingCount} admin(s) in the database. Skipping seed.`);
        console.log('To add more admins, log in and use POST /api/admins instead.');
        await prisma.$disconnect();
        return;
    }
    const name = (await ask('Admin name: ')).trim();
    const email = (await ask('Admin email: ')).trim();
    const password = await ask('Admin password (min 8 chars): ');
    if (!name || !email || password.length < 8) {
        console.error('Name, email, and an 8+ character password are required.');
        await prisma.$disconnect();
        process.exit(1);
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
        data: {
            name,
            email,
            password: passwordHash,
            role: 'super_admin',
            isActive: true,
        },
    });
    console.log(`✅ Super admin "${email}" created. You can now log in via POST /api/auth/login`);
    await prisma.$disconnect();
}
main().catch(async (err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
//# sourceMappingURL=seed-admin.js.map
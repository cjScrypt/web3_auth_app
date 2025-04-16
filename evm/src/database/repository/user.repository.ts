import { PrismaClient } from "@prisma/client";

export class UserRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
}
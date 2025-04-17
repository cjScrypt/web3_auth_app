import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "../../types";

export class UserRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async create(data: CreateUserDto) {
        return this.prisma.user.create({ data });
    }

    async findOne(filter: {}) {
        return this.prisma.user.findFirst({
            where: filter
        });
    }
}
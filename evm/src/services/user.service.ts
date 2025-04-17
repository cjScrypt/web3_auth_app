import { UserRepository } from "../database/repository";
import prisma from "../database/prisma/client";

export class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(prisma);
    }

    async getUser(filter: { id?: string, walletAddress?: string }) {
        return this.userRepository.findOne(filter);
    }

    async getOrCreateUser(walletAddress: string) {
        let user = await this.getUser({ walletAddress });
        if (!user) {
            user = await this.userRepository.create({ walletAddress });
        }

        return user;
    }
}
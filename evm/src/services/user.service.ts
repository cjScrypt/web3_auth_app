import { UserRepository } from "../database/repository";
import prisma from "../database/prisma/client";

export class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(prisma);
    }

    async getOrCreateUser(walletAddress: string) {
        let user = await this.userRepository.findOne({ walletAddress });
        if (!user) {
            user = await this.userRepository.create({ walletAddress });
        }

        return user;
    }
}
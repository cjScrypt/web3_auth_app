import { UserRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { JwtUtils } from "../utils";

export class AuthService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository(prisma);
    }

    async generateSigninPayload(address: string) {
        const payload = { address }
        const payloadToken = JwtUtils.walletProofSignature(payload);

        return payloadToken;
    }
}
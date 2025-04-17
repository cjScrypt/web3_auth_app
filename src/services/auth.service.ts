import { ethers } from "ethers";
import { User } from "@prisma/client";
import { UserRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { WalletSignInDto } from "../types";
import { JwtUtils } from "../utils";
import { UserService } from "./user.service";

export class AuthService {
    private readonly userRepository: UserRepository;
    private readonly userService: UserService;

    constructor() {
        this.userRepository = new UserRepository(prisma);
        this.userService = new UserService()
    }

    async generateSigninPayload(address: string) {
        const payload = { address }
        const payloadToken = JwtUtils.walletProofSignature(payload);

        return payloadToken;
    }

    private checkProof(data: WalletSignInDto) {
        const decoded = JwtUtils.verifyToken(data.payloadToken);
        if (!decoded) {
            throw new Error("Invalid or expired token");
        }

        const expectedAddress = decoded.address;
        if (data.address != expectedAddress) {
            throw new Error("Invalid wallet address");
        }

        const recoveredAddress = ethers.verifyMessage(expectedAddress, data.signature);
        if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
            throw new Error("Invalid signature");
        }

        return true;
    }

    async signIn(data: WalletSignInDto) {
        this.checkProof(data);

        const user = await this.userService.getOrCreateUser(data.address);

        const token = JwtUtils.generateAuthToken({ id: user.id });

        return { token, user };
    }
}
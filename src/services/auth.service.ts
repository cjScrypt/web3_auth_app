import { ethers } from "ethers";
import { UserService } from "./user.service";
import { ChainId, WalletSignInDto } from "../types";
import { JwtUtils } from "../utils";

export class AuthService {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService()
    }

    async generateSigninPayload(address: string, chainId: ChainId) {
        const payload = { address, chainId }
        const payloadToken = JwtUtils.walletProofSignature(payload);

        return payloadToken;
    }

    private checkProofEVM(data: WalletSignInDto) {
        const decoded = JwtUtils.verifyToken(data.payloadToken);
        if (!decoded) {
            throw new Error("Invalid or expired token");
        }

        if (decoded.chainId !== "evm") {
            throw new Error("Chain mismatch. Expected 'EVM' signature");
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

    async signInEVM(data: WalletSignInDto) {
        this.checkProofEVM(data);

        const user = await this.userService.getOrCreateUser(data.address);

        const token = JwtUtils.generateAuthToken({ id: user.id });

        return { token, user };
    }
}
import { ethers } from "ethers";
import { UserService } from "./user.service";
import { CHAIN_ID, CheckProofDto, WalletSignInDto } from "../types";
import { JwtUtils } from "../utils";
import { TonProofService } from "./tonProof.service";

export class AuthService {
    private readonly tonProofService: TonProofService;
    private readonly userService: UserService;

    constructor() {
        this.tonProofService = new TonProofService();
        this.userService = new UserService()
    }

    async generateSigninPayload(address: string, chainId: CHAIN_ID) {
        const payload = { address, chainId }
        const payloadToken = JwtUtils.walletProofSignature(payload);

        return payloadToken;
    }

    private checkProofEVM(data: WalletSignInDto) {
        const decoded = JwtUtils.verifyToken(data.payloadToken);
        if (!decoded) {
            throw new Error("Invalid or expired token");
        }

        if (decoded.chainId !== CHAIN_ID.EVM) {
            throw new Error("Chain mismatch. Expected 'EVM' signature");
        }

        const expectedAddress = decoded.address;
        if (data.address != expectedAddress) {
            throw new Error("Invalid wallet address");
        }

        const recoveredAddress = ethers.verifyMessage(expectedAddress, data.proof);
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

    async signInTON(data: CheckProofDto) {
        await this.tonProofService.checkProof(data);

        const user = await this.userService.getOrCreateUser(data.address);

        const token = JwtUtils.generateAuthToken({ id: user.id });

        return { token, user };
    }
}
import { EvmProofService } from "./evmProofService";
import { TonProofService } from "./tonProof.service";
import { UserService } from "./user.service";
import { CHAIN_ID, CheckProofDto, CheckEvmProofDto } from "../types";
import { JwtUtils } from "../utils";

export class AuthService {
    private readonly evmProofService: EvmProofService;
    private readonly tonProofService: TonProofService;
    private readonly userService: UserService;

    constructor() {
        this.evmProofService = new EvmProofService();
        this.tonProofService = new TonProofService();
        this.userService = new UserService()
    }

    private async loginByAddress(address: string) {
        const user = await this.userService.getOrCreateUser(address);

        const token = JwtUtils.generateAuthToken({ id: user.id });

        return { token, user };
    }

    private async verifySigninPayload(payloadToken: string, address: string, chainId: CHAIN_ID) {
        const decoded = JwtUtils.verifyToken(payloadToken);
        if (!decoded) {
            throw new Error("Invalid or expired token");
        }

        if (decoded.address != address) {
            throw new Error("Invalid wallet address");
        }

        if (decoded.chainId !== chainId) {
            throw new Error(`Chain mismatch. Expected ${chainId} proof`);
        }

        return true;
    }

    async generateSigninPayload(address: string, chainId: CHAIN_ID) {
        const payload = { address, chainId }
        const payloadToken = JwtUtils.walletProofSignature(payload);

        return payloadToken;
    }

    async signInEVM(data: CheckEvmProofDto) {
        await this.verifySigninPayload(
            data.payloadToken,
            data.address,
            CHAIN_ID.EVM
        );

        const isValid = this.evmProofService.checkProof(data);
        if (!isValid) {
            throw new Error("Invalid proof");
        }

        return this.loginByAddress(data.address);
    }

    async signInTON(data: CheckProofDto) {
        await this.verifySigninPayload(
            data.proof.payload,
            data.address,
            CHAIN_ID.TON
        );

        const isValid = await this.tonProofService.checkProof(data);
        if (!isValid) {
            throw new Error("Invalid proof");
        }

        return this.loginByAddress(data.address);
    }
}
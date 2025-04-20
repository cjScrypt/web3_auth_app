import { EvmProofService } from "./evmProofService";
import { TonProofService } from "./tonProof.service";
import { UserService } from "./user.service";
import { CHAIN_ID, CheckProofDto, WalletSignInDto } from "../types";
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

    async signInEVM(data: WalletSignInDto) {
        await this.verifySigninPayload(
            data.payloadToken,
            data.address,
            CHAIN_ID.EVM
        );

        this.evmProofService.checkProof(data);

        const user = await this.userService.getOrCreateUser(data.address);

        const token = JwtUtils.generateAuthToken({ id: user.id });

        return { token, user };
    }

    async signInTON(data: CheckProofDto) {
        await this.verifySigninPayload(
            data.proof.payload,
            data.address,
            CHAIN_ID.TON
        );

        await this.tonProofService.checkProof(data);

        const user = await this.userService.getOrCreateUser(data.address);

        const token = JwtUtils.generateAuthToken({ id: user.id });

        return { token, user };
    }
}
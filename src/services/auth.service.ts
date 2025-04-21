import { EvmProofService } from "./evmProofService";
import { RedisService } from "./redis.service";
import { TonProofService } from "./tonProof.service";
import { UserService } from "./user.service";
import { CHAIN_ID, CheckTonProofDto, CheckEvmProofDto } from "../types";
import { JwtUtils } from "../utils";

export class AuthService {
    private readonly evmProofService: EvmProofService;
    private readonly redisService: RedisService;
    private readonly tonProofService: TonProofService;
    private readonly userService: UserService;

    constructor() {
        this.evmProofService = new EvmProofService();
        this.redisService = new RedisService();
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
            throw new Error("Invalid or expired payload");
        }

        const key = `nonce_${address}`;
        const nonce = await this.redisService.getValue(key);
        if (!nonce || nonce !== decoded.nonce) {
            throw new Error("Invalid or expired payload");
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
        const key = `nonce_${address}`;
        const nonce = Math.random().toString().substring(2).slice(0, 10);
        await this.redisService.setValue(key, nonce, 15 * 60);

        const payload = { address, chainId, nonce }
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

    async signInTON(data: CheckTonProofDto) {
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
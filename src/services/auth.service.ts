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
        this.tonProofService = new TonProofService();
        this.userService = new UserService()
    }

    async generateSigninPayload(address: string, chainId: CHAIN_ID) {
        const payload = { address, chainId }
        const payloadToken = JwtUtils.walletProofSignature(payload);

        return payloadToken;
    }

    async signInEVM(data: WalletSignInDto) {
        this.evmProofService.checkProof(data);

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
import { ethers } from "ethers";
import { CHAIN_ID, WalletSignInDto } from "../types";
import { JwtUtils } from "../utils";

export class EvmProofService {
    checkProof(data: WalletSignInDto) {
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
}
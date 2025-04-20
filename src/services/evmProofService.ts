import { ethers } from "ethers";
import { WalletSignInDto } from "../types";

export class EvmProofService {
    checkProof(data: WalletSignInDto) {
        const expectedAddress = data.address;
        const recoveredAddress = ethers.verifyMessage(expectedAddress, data.proof);

        if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
            throw new Error("Invalid signature");
        }

        return true;
    }
}
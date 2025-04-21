import { ethers } from "ethers";
import { CheckEvmProofDto } from "../types";

export class EvmProofService {
    checkProof(data: CheckEvmProofDto) {
        const expectedAddress = data.address;
        const recoveredAddress = ethers.verifyMessage(expectedAddress, data.proof);

        if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
            return false;
        }

        return true;
    }
}
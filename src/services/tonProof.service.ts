import { Address, Cell, contractAddress, loadStateInit } from "@ton/ton";
import { sha256 } from "@ton/crypto";
import { sign } from "tweetnacl";

import { TonApiService } from "./tonApi.service";
import { CheckTonProofDto } from "../types";
import { parsePublicKey } from "../utils";

const tonProofPrefix = "ton-proof-item-v2/";
const tonConnectPrefix = "ton-connect";
const allowedDomains: string[] = []
const validAuthTime = 15 * 60; // 15 minutes

export class TonProofService {
    async checkProof(payload: CheckTonProofDto) {
        try {
            const stateInit = loadStateInit(Cell.fromBase64(payload.proof.state_init).beginParse());
            const client = TonApiService.create(payload.network)

            // 1. First, try to obtain public key via get_public_key get-method on smart contract deployed at Address.
            // 2. If the smart contract is not deployed yet, or the get-method is missing, parse wallet state init and get public key.
            let publicKey = await client.getWalletPublicKey(payload.address) || parsePublicKey(stateInit);
            if (!publicKey) {
                return false;
            }

            // Check that CheckProofDto.publicKey equals to obtained public key
            const wantedPublicKey = Buffer.from(payload.public_key, "hex");
            if (!publicKey.equals(wantedPublicKey)) {
                return false;
            }

            // Check that CheckProofDto.address equals to derived wallet address
            const wantedAddress = Address.parse(payload.address);
            const address = contractAddress(wantedAddress.workChain, stateInit);
            if (!address.equals(wantedAddress)) {
                return false;
            }

            // Check that CheckProofDto.proof.domain.value is in allowedDomains
            if (!allowedDomains.includes(payload.proof.domain.value)) {
                return false;
            }

            const now = Math.floor(Date.now() / 1000);
            if (now - validAuthTime > payload.proof.timestamp) {
                return false;
            }

            const isValid = await this.verifySignature(payload, address, publicKey);

            return isValid;
        } catch (error) {
            return false;
        }
    }

    /**
     * Rebuilds the TonConnect message and verifies the authenticity of the `CheckProofDto.signature`
     * using the `tweetnacl.sign.detached.verify` method.
     */
    private async verifySignature(payload: CheckTonProofDto, address: Address, publicKey: Buffer<ArrayBuffer>) {
        const message = {
            workchain: address.workChain,
            address: address.hash,
            domain: {
                lengthBytes: payload.proof.domain.lengthBytes,
                value: payload.proof.domain.value
            },
            signature: Buffer.from(payload.proof.signature, "base64"),
            payload: payload.proof.payload,
            stateInit: payload.proof.state_init,
            timestamp: payload.proof.timestamp
        }

        const workchain = Buffer.alloc(4);
        workchain.writeUint32BE(message.workchain, 0);

        const timestamp = Buffer.alloc(8);
        timestamp.writeBigUint64LE(BigInt(message.timestamp), 0);

        const domainLength = Buffer.alloc(4);
        domainLength.writeUint32LE(message.domain.lengthBytes, 0);

        // message = utf8_encode("ton-proof-item-v2/") ++
        //           Address ++
        //           AppDomain ++
        //           Timestamp ++
        //           Payload
        const msg = Buffer.concat([
            Buffer.from(tonProofPrefix),
            workchain,
            message.address,
            domainLength,
            Buffer.from(message.domain.value),
            timestamp,
            Buffer.from(message.payload)
        ]);

        const msgHash = Buffer.from(await sha256(msg));

        // signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
        const fullMsg = Buffer.concat([
            Buffer.from([0xff, 0xff]),
            Buffer.from(tonConnectPrefix),
            msgHash
        ]);

        const result = Buffer.from(await sha256(fullMsg));

        return sign.detached.verify(result, message.signature, publicKey);
    }
}
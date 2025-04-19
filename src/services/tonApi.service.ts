import { Address, TonClient4 } from "@ton/ton";
import { CHAIN } from "@tonconnect/ui-react";
import { TON_API_MAINNET, TON_API_TESTNET } from "../config";

export class TonApiService {
    private readonly client: TonClient4;

    constructor(client: TonClient4) {
        this.client = client;
    }

    static create(chain: CHAIN) {
        let client: TonClient4;

        if (chain === CHAIN.MAINNET) {
            client = new TonClient4({
                endpoint: TON_API_MAINNET
            });
        } else {
            client = new TonClient4({
                endpoint: TON_API_TESTNET
            });
        }

        return new TonApiService(client);
    }

    async getWalletPublicKey(address: string) {
        let result;

        try {
            const lastBlock = await this.client.getLastBlock();
            result = await this.client.runMethod(
                lastBlock.last.seqno,
                Address.parse(address),
                "get_public_key",
                []
            );
        } catch (error) {
            return null;
        }

        return Buffer.from(result.reader.readBigNumber().toString(16).padStart(64, "0"), "hex");
    }
}
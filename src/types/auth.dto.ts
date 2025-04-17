export type ChainId = "evm" | "ton";

export interface GeneratePayloadDto {
    address: string,
    chainId: ChainId
}

export interface WalletSignInDto {
    proof: string,
    address: string,
    payloadToken: string
}
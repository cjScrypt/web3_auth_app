export type ChainId = "evm" | "ton";

export interface GeneratePayloadDto {
    address: string,
    chainId: ChainId
}

export interface WalletSignInDto {
    signature: string,
    address: string,
    payloadToken: string
}
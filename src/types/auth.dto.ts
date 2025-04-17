export interface GeneratePayloadDto {
    address: string
}

export interface WalletSignInDto {
    signature: string,
    address: string,
    payloadToken: string
}
import { IsEnum, IsString } from "class-validator";

export enum CHAIN_ID {
    EVM,
    TON
}

export class GeneratePayloadDto {
    @IsString()
    address: string;

    @IsEnum(CHAIN_ID)
    chainId: CHAIN_ID;
}

export class CheckEvmProofDto {
    @IsString()
    proof: string;

    @IsString()
    address: string;

    @IsString()
    payloadToken: string;
}
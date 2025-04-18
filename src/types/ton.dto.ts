import { CHAIN } from "@tonconnect/ui-react";
import { IsEnum, IsNumber, IsString, ValidateNested } from "class-validator"

enum NETWORK {
    MAINNET,
    TESTNET
}

class DomainDto {
    @IsNumber()
    lengthBytes: number;

    @IsString()
    value: string;
}

class ProofDto {
    @IsNumber()
    timestamp: number;

    @ValidateNested()
    domain: DomainDto;

    @IsString()
    payload: string;

    @IsString()
    signature: string;

    @IsString()
    state_init: string;
}

export class CheckProofDto {
    @IsString()
    address: string;

    @IsEnum([CHAIN.MAINNET, CHAIN.TESTNET])
    network: CHAIN;

    @IsString()
    public_key: string;

    @ValidateNested()
    proof: ProofDto
}
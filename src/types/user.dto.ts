import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    walletAddress: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;
}
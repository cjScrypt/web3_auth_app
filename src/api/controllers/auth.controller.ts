import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services";
import { GeneratePayloadDto, WalletSignInDto } from "../../types";

export class AuthController {
    static async generatePayload(req: Request, res: Response, next: NextFunction) {
        try {
            const { address, chainId } = req.body as GeneratePayloadDto;

            const data = await (new AuthService()).generateSigninPayload(
                address,
                chainId
            );

            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    }

    static async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const { signature, address, payloadToken } = req.body as WalletSignInDto;

            const data = await (new AuthService()).signIn({
                signature,
                address,
                payloadToken
            });

            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    }
}
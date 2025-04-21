import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services";
import { CheckTonProofDto, GeneratePayloadDto, CheckEvmProofDto } from "../../types";

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

    static async signinEVM(req: Request, res: Response, next: NextFunction) {
        try {
            const { proof, address, payloadToken } = req.body as CheckEvmProofDto;

            const data = await (new AuthService()).signInEVM({
                proof,
                address,
                payloadToken
            });

            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    }

    static async signinTON(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as CheckTonProofDto;

            const { user, token } = await (new AuthService()).signInTON(data);

            res.status(200).json({ data: {
                user,
                token
            }});
        } catch (error) {
            next(error);
        }
    }
}
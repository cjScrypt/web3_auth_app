import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services";
import { GeneratePayloadDto } from "../../types";

export class AuthController {
    static async generatePayload(req: Request, res: Response, next: NextFunction) {
        try {
            const { address } = req.body as GeneratePayloadDto;

            const data = await (new AuthService()).generateSigninPayload(address);

            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    }
}
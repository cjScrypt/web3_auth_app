import jwt from "jsonwebtoken";
import { JWT_SECRET, WALLET_PROOF_EXPIRY } from "../config";
import { GeneratePayloadDto } from "../types";

export class JwtUtils {
    static walletProofSignature(payload: GeneratePayloadDto) {
        return jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "30m", algorithm: "HS256" }
        );
    }
}
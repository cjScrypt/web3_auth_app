import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { GeneratePayloadDto } from "../types";

export class JwtUtils {
    static walletProofSignature(payload: GeneratePayloadDto) {
        return jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "30m", algorithm: "HS256" }
        );
    }

    static generateAuthToken(payload: {}) {
        return jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "24h", algorithm: "HS256" }
        );
    }

    static verifyToken(token: string) {
        try {
            const decoded = jwt.verify(
                token,
                JWT_SECRET,
                { algorithms: ["HS256"] }
            );

            if (typeof decoded !== "string") {
                return decoded;
            }
        } catch (error) {
            return null;
        }

        return null;
    }
}
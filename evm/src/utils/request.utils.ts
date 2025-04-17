import { Request } from "express";

export class RequestUtils {
    static extractBearerTokenFromHeader(req: Request) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return undefined;
        }

        const [ type, token ] = authHeader.split(' ');

        return type === 'Bearer' ? token : undefined;
    }
}
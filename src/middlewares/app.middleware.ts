import { json, urlencoded } from "body-parser";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import { JwtUtils, RequestUtils } from "../utils";
import { UserService } from "../services";

export class AppMiddleware {
    static addCorsHeaderToResponse = cors();
    static addBodyToRequestFromJson = json();
    static addBodyToRequestFromUrl = urlencoded({ extended: false });

    static async addUserToRequestFromAuth(req: Request, res: Response, next: NextFunction) {
        const token = RequestUtils.extractBearerTokenFromHeader(req);
        if (!token) {
            return next();
        }

        const decoded = JwtUtils.verifyToken(token);
        if (!decoded) {
            throw new Error("Invalid or expired auth token"); // @todo Attach status code
        }

        const user = await (new UserService()).getUser({ id: decoded.id });
        if (!user) {
            return next();
        }

        req['user'] = user;

        return next();
    }

    static validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const body = plainToInstance(dtoClass, req.body);

            const errors = await validate(body);
            if (errors.length > 0) {
                throw errors;
            }

            req.body = body;

            next();
        }
    }
}
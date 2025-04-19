import { Router } from "express";
import { AuthController } from "../controllers";
import { AppMiddleware } from "../../middlewares";
import { CheckProofDto } from "../../types";

export const authRouter = Router();

authRouter.post(
    "generatePayload",
    AuthController.generatePayload
);

authRouter.post(
    "signin-evm",
    AuthController.signinEVM
);

authRouter.post(
    "signin-ton",
    AppMiddleware.validateDto(CheckProofDto),
    AuthController.signinEVM
);
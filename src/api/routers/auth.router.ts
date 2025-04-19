import { Router } from "express";
import { AuthController } from "../controllers";

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
    AuthController.signinEVM
);
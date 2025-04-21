import { Router } from "express";
import { AuthController } from "../controllers";
import { AppMiddleware } from "../../middlewares";
import { CheckProofDto, GeneratePayloadDto, CheckEvmProofDto } from "../../types";

export const authRouter = Router();

authRouter.post(
    "generatePayload",
    AppMiddleware.validateDto(GeneratePayloadDto),
    AuthController.generatePayload
);

authRouter.post(
    "signin-evm",
    AppMiddleware.validateDto(CheckEvmProofDto),
    AuthController.signinEVM
);

authRouter.post(
    "signin-ton",
    AppMiddleware.validateDto(CheckProofDto),
    AuthController.signinEVM
);
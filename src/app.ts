import { Express } from "express";
import { authRouter } from "./api/routers";
import { AppMiddleware } from "./middlewares";

export const configureApp = (app: Express) => {
    app.use(AppMiddleware.addBodyToRequestFromJson);
    app.use(AppMiddleware.addBodyToRequestFromUrl);
    app.use(AppMiddleware.addCorsHeaderToResponse);

    app.use(AppMiddleware.addUserToRequestFromAuth);

    app.use("auth", authRouter);
}
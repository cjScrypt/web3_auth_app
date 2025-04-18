import express from "express";
import 'reflect-metadata';

import { configureApp } from "./app";
import { PORT } from "./config";

const main = async () => {
    const app = express();

    configureApp(app);

    app.listen(PORT, () => {
        console.log(`======= App running on port ${PORT} =======`);
    });
}

main();
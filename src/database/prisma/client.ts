import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../../config";

export default new PrismaClient({
    datasources: {
        db: { url: DATABASE_URL }
    }
});
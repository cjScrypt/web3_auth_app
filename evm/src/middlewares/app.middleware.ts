import { json, urlencoded } from "body-parser";
import cors from "cors";

export class AppMiddleware {
    static addCorsHeaderToResponse = cors();
    static addBodyToRequestFromJson = json();
    static addBodyToRequestFromUrl = urlencoded({ extended: false });
}
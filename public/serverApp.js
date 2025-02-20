"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = void 0;
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
// parametres du serveur d'applications
const port = 3000;
exports.port = port;
routes_1.app.set('view engine', 'ejs');
routes_1.app.set('views', path_1.default.join(__dirname, '../views'));
const cors = require("cors");
routes_1.app.use(cors({
    origin: "http://localhost:3000", // Mets l'URL de ton frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"] // 🔥 Permet Authorization
}));
routes_1.app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

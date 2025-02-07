"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
exports.app = app;
const port = 3000;
exports.port = port;
app.get("/", (req, res) => {
    res.status(200);
    // res.json({ "super": "Hello word" }); // testé avec response.body.super
    res.send("Hello word"); // testé avec response.text
});
app.get("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // créer ou utiliser une table d'utilisateurs dans ma_nouvelle_bdd
    // connexion à la bd
    mongoose_1.default.connect("mongodb://localhost:27017/ma_nouvelle_bdd");
    console.log("Connected to MongoDB");
    // Define the User schema and model
    const userSchema = new mongoose_1.default.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    });
    const User = mongoose_1.default.model("User", userSchema);
    console.log("User model created");
    try {
        // const user = new User(req.body);
        const user = new User({ firstName: "jp", lastName: "jp", email: "toto@gmail.com" });
        yield user.save();
        res.status(201).json(user);
        console.log("User created");
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally {
        mongoose_1.default.connection.close();
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/signup`);
});

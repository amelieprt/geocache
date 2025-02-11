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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const serverApp_1 = require("./serverApp");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return serverApp_1.app; } });
// parser le json
serverApp_1.app.use(express_1.default.json());
// route pour ajouter un utilisateur
// curl -X POST "http://localhost:3000/user" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'       
serverApp_1.app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, users_1.addUser)(req.body);
        res.status(201);
        res.send("Inscription réussie"); // TODO : retourner un token et une page de redirection
    }
    catch (error) {
        console.error;
        res.status(500);
        res.send("Inscription échouée " + error); // TODO : retourner une page d'erreur
    }
}));
// route pour verifier le login
serverApp_1.app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, users_1.checkLogin)(req.body);
        res.status(200);
        res.send("Connexion réussie"); // TODO : (APRES TOUS LES AUTRES TODO) retourner un token et une page de redirection 
    }
    catch (error) {
        console.error;
        res.status(500);
        res.send("Connexion échouée " + error); // TODO : retourner une page d'erreur
    }
}));

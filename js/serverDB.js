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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
const mongodb_1 = require("mongodb");
// parametres du serveur de données
const uri = "mongodb+srv://amelieperrot33:pa60YV9jFDvKV8pv@cluster0.ahcni.mongodb.net/ma_nouvelle_bdd?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb://localhost:27017";
// const uri = "mongodb://127.0.0.1:27017/ma_nouvelle_bdd"; // process.env.SCALINGO_MONGO_URL || 
// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ma_nouvelle_bdd';
const dbname = "ma_nouvelle_bdd";
// connexion à la base de données
let db;
// {
//     let client = new MongoClient(uri);
//     try {
//         // Connect to the MongoDB cluster
//         client.connect();
//         // Specify the database and collection
//         db = client.db(dbname);
//     } finally {
//         // Close the connection to the MongoDB cluster
//         // client.close(); // TODO : quand faut-il fermer la connexion
//     }
// }
// Fonction pour se connecter et exporter la base de données
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        console.log("✅ Connecté à MongoDB Atlas");
        exports.db = db = client.db(dbname);
    }
    catch (error) {
        console.error("❌ Erreur de connexion à MongoDB:", error);
    }
});
exports.connectDB = connectDB;

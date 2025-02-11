"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongodb_1 = require("mongodb");
// parametres du serveur de données
const uri = "mongodb://localhost:27017";
const dbname = "ma_nouvelle_bdd";
// connexion à la base de données
let temp;
{
    let client = new mongodb_1.MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        client.connect();
        // Specify the database and collection
        temp = client.db(dbname);
    }
    finally {
        // Close the connection to the MongoDB cluster
        // client.close(); // TODO : quand faut-il fermer la connexion
    }
}
const db = temp;
exports.db = db;

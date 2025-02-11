import { MongoClient } from 'mongodb';

// parametres du serveur de données
const uri = "mongodb://localhost:27017";
const dbname = "ma_nouvelle_bdd";

// connexion à la base de données
let temp: any;
{
    let client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        client.connect();

        // Specify the database and collection
        temp = client.db(dbname);
    } finally {
        // Close the connection to the MongoDB cluster
        // client.close(); // TODO : quand faut-il fermer la connexion
    }
}
const db = temp;
export { db };
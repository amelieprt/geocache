import { MongoClient } from 'mongodb';

// parametres du serveur de données
const uri = "mongodb+srv://amelieperrot33:pa60YV9jFDvKV8pv@cluster0.ahcni.mongodb.net/ma_nouvelle_bdd?retryWrites=true&w=majority&appName=Cluster0";

// const uri = "mongodb://localhost:27017";
// const uri = "mongodb://127.0.0.1:27017/ma_nouvelle_bdd"; // process.env.SCALINGO_MONGO_URL || 
// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ma_nouvelle_bdd';


const dbname = "ma_nouvelle_bdd";

// connexion à la base de données
let db: any
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
const connectDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("✅ Connecté à MongoDB Atlas");
        db = client.db(dbname);
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB:", error);
    }
};




export { db, connectDB };
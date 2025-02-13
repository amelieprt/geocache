const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "ma_nouvelle_bdd";

async function insertCachette() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('Cachette');

        const newCachette = {
            NameCachette: "Cachette1",
            description: "Description de la cachette",
            latitude: 48.8566,
            longitude: 2.3522,
            difficulte: 3,
            mdp: "password",

            NameCachette: "Brasa",
            description: "Feu",
            latitude: 48,
            longitude: 59,
            difficulte: 1,
            mdp: "chef"

        };


        const result = await collection.insertOne(newCachette);
        console.log(`New cachette created with the following id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

insertCachette();
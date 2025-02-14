const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "ma_nouvelle_bdd";

async function insertUser() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');

        const newuser = {
            username: "amelieprt",
            firstName: "amelie",
            lastName: "perrot",
            email: "amelie@gmail.com",
            password: "coucou",

        };


        const result = await collection.insertOne(newuser);
        console.log(`New user created with the following id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

insertUser();
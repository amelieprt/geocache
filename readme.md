typesscript : verifier les types (pour évited de faire une concaténation à la place d'une addition...).
jest : vérifier les résultats des fonctions.
supertest : vérifier les résultats des endpoints.
lint : verifier la syntaxe, les variables déclarées mais non utilisées...
endpoint : url incluant des parametres et qui retroune un résultat.
mongodb : serveur de données

code fonctionnel mais la route /signup devrait

- utiliser la méthode POST
- vérifier que l'utilisateur n'existe pas déjà
- utilser le mail comme id
- sortir la partie connexion a la bd avant toutes les routes

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
serverApp
-> routes
--> users
---> serverDB

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
description de mes collections

# // USERS

login
pass
mail
droit (admin ou pas)
photo
date inscription
pays

# // CACHETTES

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CRUD en node

CREATE / UPDATE
const result = await collection.insertOne(newUser);

READ
// lister touts les firstName de la collection users
// const cursor = await collection.find({}, { firstName: 1 }); // ATTENTION node aura quand même accès à tous les champs
// const cursor = await collection.find({}, { projection: { firstName: 1 } }); // { projection:...} OBKITGATOIRE pour ne pas avoir tous les champs
// cursor.forEach((doc: { firstName: string }) => console.log(doc.firstName));

    // trouver un utilisateur par son firstName et son lastName
    const r = await collection.findOne({ firstName: id.firstName, lastName: id.lastName }, { projection: { firstName: 1, lastName: 1, _id: 0 } });
    console.log("r", r);
    if (r && r.firstName === id.firstName && r.lastName === id.lastName)
        console.log("OK :)");
    else
        console.log("KO :(");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
méthode (get ou post) + format de donnée (json, urlencode avec ous sans étiquette)
=> parseur + route (json, urlencode) + objet de récupération (param, body, query)
// DONE
// GET + JSON (req.body)
// curl -X GET "http://localhost:3000/" -H "Content-Type:application/json" -d '{"firstName": "jppppppppppppp POST", "lastName": "doe", "email": "POSTdoe @gmail.com"}'
// GET + URLENCODED (req.query)
// curl -X GET "http://localhost:3000/?firstName=amelieeeeeeeeeeeeeeGET&lastName=doe&email=GETdoe@gmail.com"
// GET + URLENCODED (req.params) app.get('/user/:firstName/:lastName/:email', (req, res) => {...
// curl -X GET "http://localhost:3000/user/1111/22222/33333"
// POST + URLENCODED (req.params) app.post('/user/:firstName/:lastName/:email', (req, res) => {...
// curl -X POST "http://localhost:3000/user/5555/66/777"
// POST + URLENCODED (req.query)
// curl -X POST "http://localhost:3000/?firstName=aaaaaaaa&lastName=bbbb&email=ccccccc"
// POST + JSON (req.body)
// curl -X POST "http://localhost:3000/" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx", "lastName": "yyyyy", "email": "zzzz"}'
// pour json : app.use(express.json());
// pour le reste : app.use(express.urlencoded({ extended: true }));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COnnexion à une base de donnée mongo depuis node
// création d'un serveur sur la route /  
import express from "express";
import { MongoClient } from 'mongodb';
const app = express();
const port = 3000;

async function main() {
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db('ma_nouvelle_bdd'); // DB NAME
        const collection = database.collection('users'); // COLLECTION NAME

        // Create a new user document
        const newUser = {
            login: "mylogin",
            password: "mypassword"
        };

        // Insert the new user document
        const result = await collection.insertOne(newUser);
        console.log(`New user created with the following id: ${result.insertedId}`);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }

}

app.get("/", (req: any, res: any) => {
main().catch(console.error);
res.status(200);
res.send("Hello word 8888");
});

app.listen(port, () => {
// console.log(`Server is running on port http://localhost:${port}/signup`);
});

export { app, port };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

tester et exporter ses requête avec compass
cliquer sur une collection
cliquer sur le bouton option (pour ouvrir les parametres de la requete)
modifier la requête (ex: dans le champ projection saisir : {email:1}) + ENTER
cliquer sur export data

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exporter le contenu d'une collection
cliquer sur une collection
menu / export collection

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

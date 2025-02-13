import { db } from './serverDB';

// Ajout d'un utilisateur avec une veriication préalable
async function addcachette(newCachette: any) {

    const collection = db.collection('Cachette'); // COLLECTION NAME


    // Insert the new user document
    const result = await collection.insertOne(newCachette);
    console.log(`New cachette created with the following id: ${result.insertedId}`);
}

// Test si le login & password d'un utilisateur sont biens dans la base de données
async function checkCachette(id: any) {
    const collection = db.collection('Cachette'); // COLLECTION NAME



    // trouver un utilisateur par son firstName et son lastName
    const r = await collection.findOne({
        NameCachette: id.NameCachette, description: id.description,
        latitude: id.latitude, longitude: id.longitude,
        difficulte: id.difficulte, mdp: id.mdp
    });
    // { projection: { firstName: 1, lastName: 1, _id: 0 } });
    // si l'utilisateur n'existe pas alors on leve une exception
    if (!r)
        throw new Error("Cachette non trouvé");
}

export { addcachette, checkCachette };
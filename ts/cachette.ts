import { db } from './serverDB';

// Ajout d'un utilisateur avec une veriication préalable
async function addcachette(newCachette: any) {

    const collection = db.collection('Cachette'); // COLLECTION NAME


    // Insert the new user document
    const result = await collection.insertOne(newCachette);
    console.log(`New cachette created with the following id: ${result.insertedId}`);
}

// Suppression d'une cachette par son nom
async function deleteCachette(name: string) {
    const collection = db.collection('Cachette');

    // Vérifier si la cachette existe
    const cachette = await collection.findOne({ nom: name });
    console.log("Cachette trouvée :", cachette);

    if (!cachette) {
        throw new Error("Cachette non trouvée");
    }

    // Supprimer la cachette
    const result = await collection.deleteOne({ nom: name });

    if (result.deletedCount === 0) {
        throw new Error("Suppression échouée, cachette non trouvée");
    }

    console.log(`Cachette avec le nom ${name} supprimée`);
}

// Lecture d'une cachette par son nom
async function readCachette(nom: string) {
    const collection = db.collection('Cachette'); // COLLECTION NAME

    // Find the cachette document
    const cachette = await collection.findOne({ nom: nom });
    if (!cachette) {
        throw new Error("Cachette non trouvée");
    }
    return cachette;
}

// AFFICHER TT LES CACHETTES ////

async function readAllCachettes() {
    const collection = db.collection('Cachette'); // COLLECTION NAME
    const cachettes = await collection.find({}).toArray();
    return cachettes;
}

// Mise à jour d'une cachette par son nom
async function updateCachette(name: string, updatedCachette: any) {
    const collection = db.collection('Cachette'); // COLLECTION NAME

    // Update the cachette document
    const result = await collection.updateOne(
        { nom: name },
        { $set: updatedCachette }
    );
    if (result.matchedCount === 0) {
        throw new Error("Cachette non trouvée");
    }
    console.log(`Cachette with name ${name} updated`);
}

// Test si la cachette sont biens dans la base de données
async function checkCachette(id: any) {
    const collection = db.collection('Cachette'); // COLLECTION NAME
    // trouver une cachette
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

export { addcachette, deleteCachette, readCachette, updateCachette, checkCachette, readAllCachettes };
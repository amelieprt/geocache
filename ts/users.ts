import { db } from './serverDB';

// Ajout d'un utilisateur avec une veriication préalable
async function addUser(newUser: any) {

    const collection = db.collection('users'); // COLLECTION NAME

    // TODO
    // Check parameters (required : email, password)
    // Check if the user already exists (email exists already)

    // Insert the new user document
    const result = await collection.insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
}


// Test si le login & password d'un utilisateur sont biens dans la base de données
async function checkLogin(id: any) {
    const collection = db.collection('users'); // COLLECTION NAME

    // TODO
    // utiliser le login & pass plutot que le firstName & lastName
    // Check no sql injection

    // trouver un utilisateur par son firstName et son lastName
    const r = await collection.findOne({ firstName: id.firstName, lastName: id.lastName, login: id.login, password: id.password }, { projection: { firstName: 1, lastName: 1, _id: 0 } });

    // si l'utilisateur n'existe pas alors on leve une exception
    if (!r)
        throw new Error("Utilisateur non trouvé");
}

// Suppression d'un utilisateur par son login
async function deleteUser(username: string) {
    const collection = db.collection('Users'); // COLLECTION NAME

    // Delete the user document
    const result = await collection.deleteOne({ username: username });
    if (result.deletedCount === 0) {
        throw new Error("Utilisateur non trouvé");
    }
    console.log(`User with login ${username} deleted`);
}

export { addUser, deleteUser, checkLogin };
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
    const r = await collection.findOne({ username: id.username, password: id.password }, { projection: { username: 1, password: 1, _id: 0 } });

    // si l'utilisateur n'existe pas alors on leve une exception
    if (!r)
        throw new Error("Utilisateur non trouvé");
}

// Suppression d'un utilisateur par son login
async function deleteUser(username: string, password: string) {
    const collection = db.collection('users'); // COLLECTION NAME

    // Delete the user document
    const result = await collection.deleteOne({ "username": username, "password": password });
    console.log("result", result)
    if (result.deletedCount === 0) {
        throw new Error("Utilisateur non trouvé");
    }
    console.log(`User with login ${username} deleted`);
}


// Mise à jour d'un utilisateur par son login
async function updateUser(username: string, updatedUser: any) {
    const collection = db.collection('Users'); // COLLECTION NAME

    // Update the user document
    const result = await collection.updateOne(
        { username: username },
        { $set: updatedUser }
    );
    if (result.matchedCount === 0) {
        throw new Error("Utilisateur non trouvé");
    }
    console.log(`User with login ${username} updated`);
}
// Lecture d'une cachette par son nom
async function readUsers(username: string) {
    const collection = db.collection('users'); // COLLECTION NAME

    // Find the cachette document
    const users = await collection.findOne({ username: username });
    if (!users) {
        throw new Error("user non trouvée");
    }
    return users;
}

export { addUser, deleteUser, updateUser, readUsers, checkLogin };
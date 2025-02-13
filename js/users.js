"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.checkLogin = checkLogin;
const serverDB_1 = require("./serverDB");
// Ajout d'un utilisateur avec une veriication préalable
function addUser(newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('users'); // COLLECTION NAME
        // TODO
        // Check parameters (required : email, password)
        // Check if the user already exists (email exists already)
        // Insert the new user document
        const result = yield collection.insertOne(newUser);
        console.log(`New user created with the following id: ${result.insertedId}`);
    });
}
// Test si le login & password d'un utilisateur sont biens dans la base de données
function checkLogin(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('users'); // COLLECTION NAME
        // TODO
        // utiliser le login & pass plutot que le firstName & lastName
        // Check no sql injection
        // trouver un utilisateur par son firstName et son lastName
        const r = yield collection.findOne({ firstName: id.firstName, lastName: id.lastName, login: id.login, password: id.password }, { projection: { firstName: 1, lastName: 1, _id: 0 } });
        // si l'utilisateur n'existe pas alors on leve une exception
        if (!r)
            throw new Error("Utilisateur non trouvé");
    });
}
// Suppression d'un utilisateur par son login
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Users'); // COLLECTION NAME
        // Delete the user document
        const result = yield collection.deleteOne({ username: username });
        if (result.deletedCount === 0) {
            throw new Error("Utilisateur non trouvé");
        }
        console.log(`User with login ${username} deleted`);
    });
}

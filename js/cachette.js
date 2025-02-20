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
exports.addcachette = addcachette;
exports.deleteCachette = deleteCachette;
exports.readCachette = readCachette;
exports.updateCachette = updateCachette;
exports.checkCachette = checkCachette;
exports.readAllCachettes = readAllCachettes;
const serverDB_1 = require("./serverDB");
// Ajout d'un utilisateur avec une veriication préalable
function addcachette(newCachette) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette'); // COLLECTION NAME
        // Insert the new user document
        const result = yield collection.insertOne(newCachette);
        console.log(`New cachette created with the following id: ${result.insertedId}`);
    });
}
// Suppression d'une cachette par son nom
function deleteCachette(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette');
        // Vérifier si la cachette existe
        const cachette = yield collection.findOne({ nom: name });
        console.log("Cachette trouvée :", cachette);
        if (!cachette) {
            throw new Error("Cachette non trouvée");
        }
        // Supprimer la cachette
        const result = yield collection.deleteOne({ nom: name });
        if (result.deletedCount === 0) {
            throw new Error("Suppression échouée, cachette non trouvée");
        }
        console.log(`Cachette avec le nom ${name} supprimée`);
    });
}
// Lecture d'une cachette par son nom
function readCachette(nom) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette'); // COLLECTION NAME
        // Find the cachette document
        const cachette = yield collection.findOne({ nom: nom });
        if (!cachette) {
            throw new Error("Cachette non trouvée");
        }
        return cachette;
    });
}
// AFFICHER TT LES CACHETTES ////
function readAllCachettes() {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette'); // COLLECTION NAME
        const cachettes = yield collection.find({}).toArray();
        return cachettes;
    });
}
// Mise à jour d'une cachette par son nom
function updateCachette(name, updatedCachette) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette'); // COLLECTION NAME
        // Update the cachette document
        const result = yield collection.updateOne({ nom: name }, { $set: updatedCachette });
        if (result.matchedCount === 0) {
            throw new Error("Cachette non trouvée");
        }
        console.log(`Cachette with name ${name} updated`);
    });
}
// Test si la cachette sont biens dans la base de données
function checkCachette(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette'); // COLLECTION NAME
        // trouver une cachette
        const r = yield collection.findOne({
            NameCachette: id.NameCachette, description: id.description,
            latitude: id.latitude, longitude: id.longitude,
            difficulte: id.difficulte, mdp: id.mdp
        });
        // { projection: { firstName: 1, lastName: 1, _id: 0 } });
        // si l'utilisateur n'existe pas alors on leve une exception
        if (!r)
            throw new Error("Cachette non trouvé");
    });
}

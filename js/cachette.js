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
exports.checkCachette = checkCachette;
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
// Test si le login & password d'un utilisateur sont biens dans la base de données
function checkCachette(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = serverDB_1.db.collection('Cachette'); // COLLECTION NAME
        // trouver un utilisateur par son firstName et son lastName
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

import express from "express";
import { addUser, checkLogin } from "./users";
import { app } from './serverApp';

// parser le json
app.use(express.json());

// route pour ajouter un utilisateur
// curl -X POST "http://localhost:3000/user" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'       
app.post('/user', async (req, res) => {
    try {
        await addUser(req.body);
        res.status(201);
        res.send("Inscription réussie"); // TODO : retourner un token et une page de redirection
    }
    catch (error) {
        console.error;
        res.status(500);
        res.send("Inscription échouée " + error); // TODO : retourner une page d'erreur
    }
});

// route pour verifier le login
app.post('/login', async (req, res) => {
    try {
        await checkLogin(req.body);
        res.status(200);
        res.send("Connexion réussie"); // TODO : (APRES TOUS LES AUTRES TODO) retourner un token et une page de redirection 
    }
    catch (error) {
        console.error;
        res.status(500);
        res.send("Connexion échouée " + error); // TODO : retourner une page d'erreur
    }
});


export { app }; // export pour les tests





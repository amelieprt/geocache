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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toto = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const method_override_1 = __importDefault(require("method-override"));
const users_1 = require("./users");
const { addUser } = require('./users');
const cachette_1 = require("./cachette");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import passport from 'passport';
// import { initializePassport, authenticateJwt } from './passport-config';
dotenv_1.default.config();
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("La clé secrète JWT n'est pas définie !");
}
const app = (0, express_1.default)();
exports.app = app;
// initializePassport();
app.use(express_1.default.json());
// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ message: "Accès refusé. Aucun token fourni." });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("La clé secrète JWT n'est pas définie !");
        }
        const decoded = jsonwebtoken_1.default.verify(token.split(" ")[1], jwtSecret); // ✅ Prend uniquement le token après "Bearer"
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};
// route pour servir la page d'accueil avec la carte Leaflet
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/index.html'));
});
// Serve static files for Leaflet
app.use('/leaflet', express_1.default.static(path_1.default.join(__dirname, '../node_modules/leaflet/dist')));
//////////////////////FORMULAIRE//////////////////////////
// route pour servir le formulaire d'inscription
app.get('/register', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/register.html'));
});
// route pour servir le formulaire de connexion
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/login.html'));
});
// route pour servir le formulaire de suppression d'utilisateur
app.get('/delete-user', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/delete-user.html'));
});
// route pour servir le formulaire de mise à jour d'utilisateur
app.get('/update-user', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/update-user.html'));
});
app.get('/read-user', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/read-user.html'));
});
///////////// CACHETTE FORMULAIRE /////////////
// route pour servir le formulaire de création de cachette
app.get('/create-cachette', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/create-cachette.html'));
});
// app.get('/read-cachette', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/read-cachette.html'));
// });
app.get('/user-profile', (req, res) => {
    const user = req.body;
    res.render('user-profile', { username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email });
});
app.get('/delete-cachette', verifyToken, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/delete-cachette.html'));
});
// route pour servir le formulaire de mise à jour de cachette
app.get('/update-cachette', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/update-cachette.html'));
});
//////////////////////////USERS////////////////////////////
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, firstName, lastName, email, password } = req.body;
        console.log("Données reçues pour l'inscription :", req.body);
        const newUser = { username, firstName, lastName, email, password };
        const result = yield addUser(newUser);
        console.log("Utilisateur ajouté :", result);
        res.status(201).redirect('/login');
    }
    catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).render('error', { message: "Inscription échouée " + errorMessage });
    }
}));
// route pour verifier le login
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login': 'mylogin', 'password': 'mypassword'}'
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, users_1.checkLogin)(req.body);
        const user = { username: "amelie", password: "test" };
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const token = jsonwebtoken_1.default.sign({ username: req.body.username, password: req.body.password }, secretKey, { expiresIn: "1h" });
        res.appendHeader("token", token);
        // res.send("coucou voici le contenu de ma page")
        // res.status(200); //
        res.redirect('/read-cachette');
        // res.status(200).json({ message: "Connexion réussie", token })
        // res.status(200).redirect('/read-cachette');
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        // exemple de requete pour tester l'erreur
        //  curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "wronglogin", "password": "wrongpassword"}'
        res.status(500).json({ "message": "Connexion échouée " + errorMessage });
        // res.send("Connexion échouée " + error); 
    }
}));
// route pour suprimer un user
// curl -X POST "http://localhost:3000/delete-user" -H "Content-Type:application/json" -d '{"username': 'mylogin', 'password': 'mypassword'}'
app.post('/delete-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400);
            return res.json({ "message": "Login et Password requis." });
        }
        yield (0, users_1.deleteUser)(username, password);
        res.status(200).redirect('/update-user');
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Suppression  échouée " + errorMessage });
    }
}));
// // route pour mettre à jour un utilisateur
app.post('/update-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, firstName, lastName, email, password } = req.body;
        console.log("Requête reçue pour mise à jour :", req.body);
        if (!username) {
            res.status(400);
            return res.json({ message: "Le login de l'utilisateur est requis." });
        }
        const updatedUser = {
            firstName,
            lastName,
            email,
            password
        };
        yield (0, users_1.updateUser)(username, updatedUser);
        console.log("Utilisateur mis à jour :", username);
        res.status(200).redirect('/create-cachette');
    }
    catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Connexion échouée " + errorMessage });
    }
}));
app.post('/read-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        console.log("Nom reçu :", username);
        if (!username) {
            res.status(400);
            return res.json({ message: "Le nom de l'utilisateur est requis." });
        }
        const cachette = yield (0, users_1.readUsers)(username);
        res.status(200).json(username);
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Connexion échouée " + errorMessage });
    }
}));
// ///////////////////CACHETTE/////////////////////////
// Tester la route /cachette pour ajoutez des nouvelles cachettes
// ajout de Middleware pour vérifier le token
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post('/create-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Requête reçue :", req.body);
        const { nom, description, longitude, latitude, difficulte, mdp } = req.body;
        if (!nom || !description || !longitude || !latitude || !difficulte || !mdp) {
            return res.status(400);
            res.json({ message: "Tous les champs sont requis." });
        }
        const nouvelleCachette = yield (0, cachette_1.addcachette)({
            nom,
            description,
            longitude,
            latitude,
            difficulte,
            mdp
        });
        res.status(201).redirect('/read-cachette');
    }
    catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Erreur inconnue";
        res.status(500);
        res.json({ "message": "Création de la cachette échouée " + errorMessage });
    }
}));
// // route pour lire une cachette
// // Verifier si lire la cachette fonctionne
// // http://localhost:3000/read-cachette?nom=Cachette1
// app.post('/read-cachette', async (req: any, res: any) => {
//     try {
//         const { nom } = req.body;
//         console.log("Nom reçu :", nom);
//         if (!nom) {
//             res.status(400);
//             return res.json({ message: "Le nom de la cachette est requis." });
//         }
//         //////////// AFFICHER UNE CACHETTE //////////////
//         // const cachette = await readCachette(nom as string);
//         /////// AFFICHER TT LES CACHETTES ////////////////
//         const cachette = await readAllCachettes();
//         // res.status(200).json(cachette);
//         res.render('read-cachette', { cachette });
//     } catch (error) {
//         console.error;
//         const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
//         res.status(500);
//         res.json({ message: "Lecture de la cachette échouée " + errorMessage });
//     }
// });
app.get('/read-cachette', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachettes = yield (0, cachette_1.readAllCachettes)();
        res.render('read-cachette', { cachettes });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la lecture des cachettes");
    }
}));
// // route pour supprimer une cachette
app.post('/delete-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom } = req.body;
        console.log("Nom reçu :", nom);
        if (!nom) {
            res.status(400);
            return res.json({ message: "Le nom de la cachette est requis." });
        }
        yield (0, cachette_1.deleteCachette)(nom);
        res.status(200).redirect('/create-cachette');
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ message: "Suppression de la cachette échouée " + errorMessage });
    }
}));
// // Middleware pour permettre les méthodes PUT et DELETE dans les formulaires HTML
app.use((0, method_override_1.default)('_method'));
app.post('/update-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, description, longitude, latitude, difficulte, mdp } = req.body;
        console.log("Requête reçue pour mise à jour :", req.body);
        if (!nom) {
            res.status(400);
            return res.json({ message: "Le nom de la cachette est requis." });
        }
        const updatedCachette = {
            description,
            longitude,
            latitude,
            difficulte,
            mdp
        };
        yield (0, cachette_1.updateCachette)(nom, updatedCachette);
        console.log("Cachette mise à jour :", nom);
        res.status(200).redirect('/read-cachette');
    }
    catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ message: "Mise à jour de la cachette échouée " + errorMessage });
    }
}));
// // Vérifier si le Token est valide
// // curl -X GET "http://localhost:3000/token" -H "Authorization: Bearer verifyToken"
// // Validation du token
// // curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "amelie", "password": "coucou"}'
app.get('/token', verifyToken, (req, res) => {
    res.send("Cette route est protégée et vous avez un token valide !");
});
const toto = app;
exports.toto = toto;

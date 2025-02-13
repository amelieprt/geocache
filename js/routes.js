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
const users_1 = require("./users");
const cachette_1 = require("./cachette");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("La clé secrète JWT n'est pas définie !");
}
const app = (0, express_1.default)();
exports.app = app;
// const secretKey = "secretKey"; //A vériifer si c'est la bonne clé
// parser le json
app.use(express_1.default.json());
// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send("Un token est requis pour l'authentification");
    }
    const token = authHeader.split(' ')[1]; // On enlève "Bearer "
    try {
        if (!secretKey) {
            return res.status(500).send("La clé secrète JWT n'est pas définie !");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).send("Token invalide");
    }
}
// route pour le succès de l'inscription
app.get('/success', (req, res) => {
    res.send("Inscription réussie ! Bienvenue !");
});
// route pour le succès de la connexion
app.get('/successlogin', (req, res) => {
    res.send("Connexion réussie ! Bienvenue !");
});
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
// route pour le succès de la suppression d'utilisateur
app.get('/successdelete-user', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/delete-user.html'));
});
// route pour servir le formulaire de création de cachette
app.get('/create-cachette', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/create-cachette.html'));
});
// redirect pour creer une cachette
app.get('/succescreate-cachette', (req, res) => {
    res.send("Création de cachette réussie ! Bienvenue !");
});
// route pour ajouter un utilisateur
// curl -X POST "http://localhost:3000/signup" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'
// curl -X POST "http://localhost:3000/signup" -H "Content-Type:application/json" -d '{"login": "amelie", "password": "coucou"}'
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, users_1.addUser)(req.body);
        // const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
        // Requete pour tester le redirection succes
        // curl -X GET "http://localhost:3000/success"
        res.status(201).redirect('/success');
        // res.send("Inscription réussie"); // TODO : retourner un token et une page de redirection
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).render('error', { message: "Inscription échouée " + errorMessage });
        // res.send("Inscription échouée " + error); // TODO : retourner une page d'erreur
    }
}));
// route pour verifier le login
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login': 'mylogin', 'password': 'mypassword'}'
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, users_1.checkLogin)(req.body);
        const token = jsonwebtoken_1.default.sign({ id: req.body.id, email: req.body.email }, secretKey, { expiresIn: '1h' });
        // res.status(200).json({ message: "Connexion réussie", token });
        res.status(200).redirect('/successlogin');
        res.send("Connexion réussie"); // TODO : (APRES TOUS LES AUTRES TODO) retourner un token JWT et une page de redirection 
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        // exemple de requete pour tester l'erreur
        //  curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "wronglogin", "password": "wrongpassword"}'
        res.status(500).render('error', { message: "Connexion échouée " + errorMessage });
        // res.send("Connexion échouée " + error); // TODO : retourner une page d'erreur
    }
}));
// suprimer un user
app.post('/delete-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        console.log("Login reçu :", username);
        if (!username) {
            return res.status(400).render('error', { message: "Le login de l'utilisateur est requis." });
        }
        yield (0, users_1.deleteUser)(username);
        res.status(200).redirect('/successdelete-user');
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).render('error', { message: "Suppression de l'utilisateur échouée " + errorMessage });
    }
}));
// Tester la route /cachette pour ajoutez des nouvelles cachettes
// ajout de Middleware pour vérifier le token
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post('/create-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Requête reçue :", req.body);
        const { nom, description, longitude, latitude, difficulte, mdp } = req.body;
        if (!nom || !description || !longitude || !latitude || !difficulte || !mdp) {
            return res.status(400).render('error', { message: "Tous les champs sont requis." });
        }
        const nouvelleCachette = yield (0, cachette_1.addcachette)({
            nom,
            description,
            longitude,
            latitude,
            difficulte,
            mdp
        });
        res.status(201).redirect('/succescreate-cachette');
    }
    catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Erreur inconnue";
        res.status(500).render('error', { message: "Création de la cachette échouée : " + errorMessage });
    }
}));
// route pour lire une cachette
// Verifier si lire la cachette fonctionne
// http://localhost:3000/read-cachette?nom=Cachette1
app.get('/read-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom } = req.query;
        console.log("Nom reçu :", nom);
        if (!nom) {
            return res.status(400).render('error', { message: "Le nom de la cachette est requis." });
        }
        const cachette = yield (0, cachette_1.readCachette)(nom);
        res.status(200).json(cachette);
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).render('error', { message: "Lecture de la cachette échouée " + errorMessage });
    }
}));
// route pour supprimer une cachette
app.post('/delete-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom } = req.body;
        console.log("Nom reçu :", nom);
        if (!nom) {
            return res.status(400).render('error', { message: "Le nom de la cachette est requis." });
        }
        yield (0, cachette_1.deleteCachette)(nom);
        res.status(200).redirect('/succesdelete-cachette');
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).render('error', { message: "Suppression de la cachette échouée " + errorMessage });
    }
}));
// Vérifier si le Token est valide
// curl -X GET "http://localhost:3000/token" -H "Authorization: Bearer verifyToken"
// Validation du token
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "amelie", "password": "coucou"}'
app.get('/token', verifyToken, (req, res) => {
    res.send("Cette route est protégée et vous avez un token valide !");
});
const toto = app;
exports.toto = toto;

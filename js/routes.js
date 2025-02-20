"use strict";
//Initialisation des dépendances utilisés et des exports de fonctions
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
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = (0, express_1.default)();
exports.app = app;
// Clée secrete pour sécurisée l'app
const SECRET_KEY = "Geocache33";
// Middelware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
// Middleware d'authentification
function verifyTokenOrSession(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // L'utilisateur est connecté
    }
    const token = req.query.token;
    if (!token) {
        return res.status(403).send("Accès refusé. Connectez-vous ou utilisez un token.");
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send("Token invalide ou expiré");
        }
        next();
    });
}
// Garder en mémoire la session de l'utilisateur avec un cookies 
app.use(session({
    secret: 'Geocache33', // La clé
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// Route de connexion login
app.post("/login", (req, res) => {
    const { username, password, firstName, lastName, email } = req.body; //Recupérer les infos de signup
    console.log("Identifiants reçus :", username, password);
    console.log("Utilisateurs enregistrés :", users);
    const user = users.find(u => u.username === username && u.password === password); //verif des bons saisie de champs
    if (!user) {
        console.log("Aucun utilisateur trouvé !");
        return res.status(401).send("Identifiants incorrects");
    }
    req.session.user = Object.assign({}, user);
    res.redirect("/read-cachette"); // Redirection après connexion
});
//Route lire les cachettes
app.get('/read-cachette', verifyTokenOrSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachettes = yield (0, cachette_1.readAllCachettes)(); //Accès à toute les cachette
        res.render('read-cachette', { cachettes });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la lecture des cachettes");
    }
}));
// Route pour générer un token temporaire (si non connecté)
app.get("/generate-token", (req, res) => {
    const token = jsonwebtoken_1.default.sign({ access: "read-cachette" }, SECRET_KEY, { expiresIn: "10m" });
    res.redirect(`/read-cachette?token=${token}`);
});
dotenv_1.default.config();
app.use(express_1.default.json());
// route pour servir la page d'accueil avec la carte Leaflet
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/index.html'));
});
// Accès à l'api leaflet
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
// Route pour voir le profil de l'utilisateur apres connexion
app.get('/user-profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    console.log("Données envoyées à EJS :", req.session.user); // 🔍 Debug
    res.render('user-profile', {
        username: req.session.user.username,
        firstName: req.session.user.firstName || '',
        lastName: req.session.user.lastName || '',
        email: req.session.user.email || ''
    });
});
// Route pour supprimer une cachette
app.get('/delete-cachette', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/delete-cachette.html'));
});
// route pour servir le formulaire de mise à jour de cachette
app.get('/update-cachette', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../views/update-cachette.html'));
});
//////////////////////////USERS////////////////////////////
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const users = []; // Simulation d'une base de données utilisateur
// Route pour s'inscrire
app.post("/signup", (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;
    if (!username || !password) {
        return res.status(400).send("Merci de fournir un username et un password.");
    }
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).send("Cet utilisateur existe déjà.");
    }
    // Ajouter l'utilisateur avec toutes les infos
    const newUser = { username, password, firstName, lastName, email };
    users.push(newUser);
    req.session.user = newUser;
    res.status(201).redirect('/login');
});
// Route pour supprimer son compte
app.post('/delete-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400);
            return res.json({ "message": "Login et Password requis." });
        }
        yield (0, users_1.deleteUser)(username, password);
        res.redirect('/login');
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Suppression  échouée " + errorMessage });
    }
}));
// // Route pour mettre à jour un utilisateur
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
        req.session.user = Object.assign(Object.assign({}, req.session.user), { firstName,
            lastName,
            email });
        console.log("Session mise à jour :", req.session.user);
        res.status(200).redirect('/user-profile');
    }
    catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Connexion échouée " + errorMessage });
    }
}));
// Route pour lire un user dans voir le profil
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
// // route pour supprimer une cachette
app.post('/delete-cachette', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom } = req.body;
        if (!nom) {
            res.status(400);
            return res.json({ message: "Le nom de la cachette est requis." });
        }
        yield (0, cachette_1.deleteCachette)(nom);
        res.status(200).redirect('/read-cachette');
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
// route pour modifier des cachettes
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
// Route pour se déconnecter 
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.redirect("/login"); // Redirige vers la page de connexion après déconnexion
    });
});
const toto = app;
exports.toto = toto;

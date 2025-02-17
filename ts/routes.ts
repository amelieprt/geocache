import express from "express";
import methodOverride from "method-override";
import { checkLogin, updateUser, deleteUser, readUsers } from "./users";
const { addUser } = require('./users');
import { addcachette, deleteCachette, readCachette, updateCachette, checkCachette } from "./cachette";
import jwt from "jsonwebtoken";
import { port } from './serverApp';
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("La clé secrète JWT n'est pas définie !");
}
const app = express();
// const secretKey = "secretKey"; //A vériifer si c'est la bonne clé
// parser le json
app.use(express.json());

// Middleware pour vérifier le token
function verifyToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send("Un token est requis pour l'authentification");
    }

    const token = authHeader.split(' ')[1]; // On enlève "Bearer "
    try {
        if (!secretKey) {
            return res.status(500).send("La clé secrète JWT n'est pas définie !");
        }
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send("Token invalide");
    }
}

// route pour servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});


//////////////////////FORMULAIRE//////////////////////////

// route pour servir le formulaire d'inscription
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

// route pour servir le formulaire de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});
// route pour servir le formulaire de suppression d'utilisateur
app.get('/delete-user', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/delete-user.html'));
});

// route pour servir le formulaire de mise à jour d'utilisateur
app.get('/update-user', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/update-user.html'));
});

app.get('/read-user', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/read-user.html'));
});

///////////// CACHETTE FORMULAIRE /////////////

// route pour servir le formulaire de création de cachette
app.get('/create-cachette', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/create-cachette.html'));
});

app.get('/read-cachette', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/read-cachette.html'));
});

app.get('/delete-cachette', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/delete-cachette.html'));
});

// route pour servir le formulaire de mise à jour de cachette
app.get('/update-cachette', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/update-cachette.html'));
});

//////////////////////////USERS////////////////////////////

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signup', async (req, res) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;
        console.log("Données reçues pour l'inscription :", req.body);

        const newUser = { username, firstName, lastName, email, password };
        const result = await addUser(newUser);
        console.log("Utilisateur ajouté :", result);

        res.status(201).redirect('/login');
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).render('error', { message: "Inscription échouée " + errorMessage });
    }
});

// route pour verifier le login
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login': 'mylogin', 'password': 'mypassword'}'

app.post('/login', async (req, res) => {
    try {
        await checkLogin(req.body);
        const token = jwt.sign({ username: req.body.username, password: req.body.password }, secretKey, { expiresIn: '1h' });
        // res.status(200).json({ message: "Connexion réussie", token });
        res.status(200).redirect('/create-cachette'); // TODO : (APRES TOUS LES AUTRES TODO) retourner un token JWT et une page de redirection 
    }
    catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        // exemple de requete pour tester l'erreur
        //  curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "wronglogin", "password": "wrongpassword"}'
        res.status(500).json({ "message": "Connexion échouée " + errorMessage });
        // res.send("Connexion échouée " + error); 
    }
});


// route pour suprimer un user
// curl -X POST "http://localhost:3000/delete-user" -H "Content-Type:application/json" -d '{"username': 'mylogin', 'password': 'mypassword'}'

app.post('/delete-user', async (req: any, res: any) => {
    try {
        const { username, password } = req.body as { username: string, password: string };

        if (!username || !password) {
            res.status(400);
            return res.json({ "message": "Login et Password requis." });
        }

        await deleteUser(username, password);

        res.redirect(200, '/successdelete-user');
    } catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Suppression  échouée " + errorMessage });
    }
});

// // route pour mettre à jour un utilisateur
app.post('/update-user', async (req: any, res: any) => {
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

        await updateUser(username, updatedUser);
        console.log("Utilisateur mis à jour :", username);

        res.redirect(200, '/create-cachette');
    } catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Connexion échouée " + errorMessage });
    }
});

app.post('/read-user', async (req: any, res: any) => {
    try {
        const { username } = req.body;
        console.log("Nom reçu :", username);

        if (!username) {
            res.status(400);
            return res.json({ message: "Le nom de l'utilisateur est requis." });
        }

        const cachette = await readUsers(username as string);

        res.status(200).json(username);
    } catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ "message": "Connexion échouée " + errorMessage });
    }

});



// ///////////////////CACHETTE/////////////////////////


// Tester la route /cachette pour ajoutez des nouvelles cachettes
// ajout de Middleware pour vérifier le token
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/create-cachette', async (req: any, res: any) => {
    try {
        console.log("Requête reçue :", req.body);
        const { nom, description, longitude, latitude, difficulte, mdp } = req.body;

        if (!nom || !description || !longitude || !latitude || !difficulte || !mdp) {
            return res.status(400);
            res.json({ message: "Tous les champs sont requis." });
        }

        const nouvelleCachette = await addcachette({
            nom,
            description,
            longitude,
            latitude,
            difficulte,
            mdp
        });

        res.redirect(201, '/succescreate-cachette');
    } catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Erreur inconnue";
        res.status(500);
        res.json({ "message": "Création de la cachette échouée " + errorMessage });
    }
});

// // route pour lire une cachette
// // Verifier si lire la cachette fonctionne
// // http://localhost:3000/read-cachette?nom=Cachette1
app.post('/read-cachette', async (req: any, res: any) => {
    try {
        const { nom } = req.body;
        console.log("Nom reçu :", nom);

        if (!nom) {
            res.status(400);
            return res.json({ message: "Le nom de la cachette est requis." });
        }

        const cachette = await readCachette(nom as string);

        res.status(200).json(cachette);
    } catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ message: "Lecture de la cachette échouée " + errorMessage });
    }
});

// // route pour supprimer une cachette
app.post('/delete-cachette', async (req: any, res: any) => {
    try {
        const { nom } = req.body;
        console.log("Nom reçu :", nom);

        if (!nom) {
            res.status(400);
            return res.json({ message: "Le nom de la cachette est requis." });
        }

        await deleteCachette(nom);

        res.redirect(200, '/succesdelete-cachette');
    } catch (error) {
        console.error;
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500)
        res.json({ message: "Suppression de la cachette échouée " + errorMessage });
    }
});

// // Middleware pour permettre les méthodes PUT et DELETE dans les formulaires HTML
app.use(methodOverride('_method'));
app.post('/update-cachette', async (req: any, res: any) => {
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

        await updateCachette(nom, updatedCachette);
        console.log("Cachette mise à jour :", nom);

        res.redirect(200, '/create-cachette');
    } catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ message: "Mise à jour de la cachette échouée " + errorMessage });
    }
});

// // Vérifier si le Token est valide
// // curl -X GET "http://localhost:3000/token" -H "Authorization: Bearer verifyToken"

// // Validation du token
// // curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "amelie", "password": "coucou"}'


app.get('/token', verifyToken, (req: any, res: any) => {
    res.send("Cette route est protégée et vous avez un token valide !");
});


const toto = app;

export { app, toto };// export pour les tests
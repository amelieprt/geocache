import express from "express";
import methodOverride from "method-override";
import { checkLogin, updateUser, deleteUser, readUsers } from "./users";
const { addUser } = require('./users');
import { addcachette, deleteCachette, readCachette, updateCachette, checkCachette, readAllCachettes } from "./cachette";
import jwt from "jsonwebtoken";
import { port } from './serverApp';
import dotenv from "dotenv";
import path from "path";
const cookieParser = require("cookie-parser");

const session = require("express-session");

const app = express();

const SECRET_KEY = "votre_cle_secrete";

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Simuler une base de données utilisateur
// const user = [{ username: "amelieprt", password: "123" }]; //{ username: "amelieprt", password: "123" }

// Middleware d'authentification
function verifyTokenOrSession(req: any, res: any, next: any) {
    if (req.session.user) {
        return next(); // Si l'utilisateur est connecté, accès direct
    }

    const token = req.query.token;
    if (!token) {
        return res.status(403).send("Accès refusé. Connectez-vous ou utilisez un token.");
    }

    jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).send("Token invalide ou expiré");
        }
        next();
    });
}



// Route de connexion
app.post("/login", (req: any, res: any) => {
    const { username, password, firstName, lastName, email } = req.body;

    console.log("Identifiants reçus :", username, password);
    console.log("Utilisateurs enregistrés :", users);

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        console.log("Aucun utilisateur trouvé !");
        return res.status(401).send("Identifiants incorrects");
    }
    // req.session.user = user;
    req.session.user = { ...user };
    res.redirect("/read-cachette"); // Redirection après connexion
});



// Route pour générer un token temporaire (si non connecté)
app.get("/generate-token", (req, res) => {
    const token = jwt.sign({ access: "read-cachette" }, SECRET_KEY, { expiresIn: "10m" });
    res.redirect(`/read-cachette?token=${token}`);
});

dotenv.config();

const bcrypt = require("bcryptjs");

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("La clé secrète JWT n'est pas définie !");
}


app.use(express.json());


// route pour servir la page d'accueil avec la carte Leaflet
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Serve static files for Leaflet
app.use('/leaflet', express.static(path.join(__dirname, '../node_modules/leaflet/dist')));


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


// app.get('/user-profile', (req, res) => {
//     const user = req.body;
//     console.log("afficher", req.body)
//     res.render('user-profile', { username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email });
// });

// app.get('/user-profile', (req: any, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login'); // Redirige si l'utilisateur n'est pas connecté
//     }

//     console.log("Utilisateur trouvé :", req.session.user);

//     const user = req.session.user;
//     res.render('user-profile', {
//         username: user.username,
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         email: user.email || ''
//     });
// });

app.get('/user-profile', (req: any, res) => {
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
// app.post('/signup', async (req, res) => {
//     try {
//         const { username, firstName, lastName, email, password } = req.body;
//         console.log("Données reçues pour l'inscription :", req.body);

//         const newUser = { username, firstName, lastName, email, password };
//         const result = await addUser(newUser);
//         console.log("Utilisateur ajouté :", result);

//         res.status(201).redirect('/login');
//     } catch (error) {
//         console.error("Erreur lors de l'inscription :", error);
//         const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
//         res.status(500).render('error', { message: "Inscription échouée " + errorMessage });
//     }
// });


const users: any[] = []; // Simulation d'une base de données utilisateur

app.post("/signup", (req: any, res: any) => {
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

    res.status(201).redirect('/login');
});




app.get('/read-cachette', verifyTokenOrSession, async (req, res) => {
    try {
        const cachettes = await readAllCachettes();
        res.render('read-cachette', { cachettes });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la lecture des cachettes");
    }
});


app.post('/delete-user', async (req: any, res: any) => {
    try {
        const { username, password } = req.body as { username: string, password: string };

        if (!username || !password) {
            res.status(400);
            return res.json({ "message": "Login et Password requis." });
        }

        await deleteUser(username, password);

        res.redirect('/update-user');
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

        req.session.user = {
            ...req.session.user,
            firstName,
            lastName,
            email
        };

        console.log("Session mise à jour :", req.session.user);

        res.status(200).redirect('/user-profile');
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

        res.status(201).redirect('/read-cachette');
    } catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Erreur inconnue";
        res.status(500);
        res.json({ "message": "Création de la cachette échouée " + errorMessage });
    }
});



// http://localhost:3000/delete-cachette nom:test
// // route pour supprimer une cachette
app.post('/delete-cachette', async (req: any, res: any) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            res.status(400);
            return res.json({ message: "Le nom de la cachette est requis." });
        }

        await deleteCachette(nom);

        res.status(200) // .redirect('/create-cachette');
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

        res.status(200).redirect('/read-cachette');
    } catch (error) {
        console.error(error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500);
        res.json({ message: "Mise à jour de la cachette échouée " + errorMessage });
    }
});

app.get("/logout", (req: any, res: any) => {
    req.session.destroy((err: any) => {  // Ici, `err` est typé en `any`
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.redirect("/login");  // Redirige vers la page de connexion après déconnexion
    });
});




const toto = app;

export { app, toto };// export pour les tests
import express from "express";
import { addUser, checkLogin } from "./users";
import { addcachette, checkCachette } from "./cachette";
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



// route pour le succès de l'inscription
app.get('/success', (req, res) => {
    res.send("Inscription réussie ! Bienvenue !");
});

app.get('/successlogin', (req, res) => {
    res.send("Connexion réussie ! Bienvenue !");
});

// route pour servir le formulaire d'inscription
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

// route pour servir le formulaire de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// route pour ajouter un utilisateur
// curl -X POST "http://localhost:3000/signup" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'
// curl -X POST "http://localhost:3000/signup" -H "Content-Type:application/json" -d '{"login": "amelie", "password": "coucou"}'

app.post('/signup', async (req, res) => {
    try {
        const user = await addUser(req.body);
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
});

// route pour verifier le login
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login': 'mylogin', 'password': 'mypassword'}'
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'


app.post('/login', async (req, res) => {
    try {
        await checkLogin(req.body);
        const token = jwt.sign({ id: req.body.id, email: req.body.email }, secretKey, { expiresIn: '1h' });
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



    // Tester la route /cachette pour ajoutez des nouvelles cachettes
    app.get('/addcachette', verifyToken, async (req: any, res: any) => {
        try {
            const newCachette = {
                NameCachette: req.query.NameCachette,
                description: req.query.description,
                latitude: req.query.latitude,
                longitude: req.query.longitude,
                difficulte: req.query.difficulte,
                mdp: req.query.mdp
            };
            await addcachette(newCachette);
            // const cachette = await addcachette(req.body);
            res.status(201).send("Cachette ajoutée");
            // const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
            // Requete pour tester le redirection succes
            // curl -X GET "http://localhost:3000/success"
            // res.status(201).redirect('/success');

        }
        catch (error) {
            console.error;
            const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
            res.status(500).render('error', { message: "Création cachette échouée " + errorMessage });
            // res.send("Inscription échouée " + error); // TODO : retourner une page d'erreur
        }
    });
});

// Vérifier si le Token est valide
// curl -X GET "http://localhost:3000/token" -H "Authorization: Bearer verifyToken"

// Validation du token
// curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"login": "amelie", "password": "coucou"}'


app.get('/token', verifyToken, (req: any, res: any) => {
    res.send("Cette route est protégée et vous avez un token valide !");
});


const toto = app;

export { app, toto };// export pour les tests
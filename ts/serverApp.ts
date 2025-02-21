import express from 'express';
import { app } from './routes';
import path from 'path';
import { connectDB } from './serverDB.js';

// parametres du serveur d'applications
const port = 3000;
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000", // Mets l'URL de ton frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"] // 🔥 Permet Authorization
}));


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

export { port };
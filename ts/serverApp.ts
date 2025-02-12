import express from 'express';
import { app } from './routes';
import path from 'path';

// parametres du serveur d'applications
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

export { port };
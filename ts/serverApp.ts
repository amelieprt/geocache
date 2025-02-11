import express from 'express';
import { } from './routes';

// parametres du serveur d'applications
const port = 3000;

const app = express();

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});

export { app, port };
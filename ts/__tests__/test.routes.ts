import request from "supertest";
import { app } from "../routes";

describe("tester les routes liées au users routes.ts", () => {

    // verifier si app est défini
    test("app devrait être défini", () => {
        expect(app).toBeDefined();
    });

    // verifier la route login
    // success test (l'utilisateur n'existe pas)
    // curl - X POST "http://localhost:3000/login" - H "Content-Type:application/json" - d '{"login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "mypassword"}'
    it("test si l'user existe dans la db avec un user inxestant.", async () => {
        const response = await request(app)
            .post("/login")
            .send({ "login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "mypassword" })
            .set("Accept", "application/json");
        // console.log(response.text);
        expect(response.statusCode).toBe(500);
    });

    // verifier la route login
    // success test (l'utilisateur existe)
    // curl - X POST "http://localhost:3000/login" - H "Content-Type:application/json" - d '{"login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "lol"}'
    it("test si l'user existe dans la db avec un user existant.", async () => {
        const response = await request(app)
            .post("/login")
            .send({ "login": "mylogin", "password": "lol" })
            .set("Accept", "application/json");
        // console.log(response.text);
        expect(response.statusCode).toBe(500);
    });

    // verifier la route signup
    // success test (l'utilisateur créé)
    // curl - X POST "http://localhost:3000/signup" - H "Content-Type:application/json" - d '{"login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "lol"}'

    // Ajouter un test pour la route /user (inscription)

    it("test ajouter un user en inscription", async () => {
        const response = await request(app)
            .post("/signup")
            .send({ "firstName": "lol", "lastName": "yyyyy1111", "email": "zzzz111111" })
            .set("Accept", "application/json");
        // console.log(response.text);
        expect(response.statusCode).toBe(201);
    });

    it("test ajouter un user en inscription avec login et password", async () => {
        const response = await request(app)
            .post("/signup")
            .send({ "login": "amelie", "password": "coucou" })
            .set("Accept", "application/json");
        // console.log(response.text);
        expect(response.statusCode).toBe(201);
    });


    // verifier la route success de signup

    it('GET / success devrait retourner "Inscription réussie ! Bienvenue !" avec le code 200', async () => {
        const response = await request(app).get("/success");
        expect(response.status).toBe(200);
        // console.log(response.text);
        expect(response.text).toBe("Inscription réussie ! Bienvenue !");
    });



});

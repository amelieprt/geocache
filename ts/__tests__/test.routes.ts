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
    it("test si l'user existe dans la db (avec un user inxestant).", async () => {
        const response = await request(app)
            .post("/login")
            .send({ username: "test_zjhsdhjkfkjsf564aze", password: "test_coucou" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(500);
    });

    // verifier la route signup
    // success test (l'utilisateur créé)
    // curl - X POST "http://localhost:3000/signup" - H "Content-Type:application/json" - d '{"login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "lol"}'
    it("test ajouter un user (avec login inexistant dans la bd)", async () => {
        const response = await request(app)
            .post("/signup")
            .send({ username: "test_zjhsdhjkfkjsf564aze", password: "test_coucou" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(201);
    });

    // verifier la route login
    // success test (l'utilisateur existe)
    // curl - X POST "http://localhost:3000/login" - H "Content-Type:application/json" - d '{"login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "lol"}'
    it("test si le user existe dans la db (avec un user existant).", async () => {
        const response = await request(app)
            .post("/login")
            .send({ username: "test_zjhsdhjkfkjsf564aze", password: "test_coucou" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
    });

    // verifier la route delete user
    // success test (l'utilisateur existe)
    // curl - X POST "http://localhost:3000/login" - H "Content-Type:application/json" - d '{"login": "myloginezrdfghyuiopiuytrezrtyuiopiuytrezaertyuiouytreza", "password": "lol"}'
    it("test la suppression d'un user (avec un user existant).", async () => {
        const response = await request(app)
            .post("/delete-user")
            .send({ username: "test_zjhsdhjkfkjsf564aze", password: "test_coucou" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
    });

    // verifier la route success de signup

    it('GET / success devrait retourner "Inscription réussie ! Bienvenue !" avec le code 200', async () => {
        const response = await request(app).get("/success");
        expect(response.status).toBe(200);
        // console.log(response.text);
        expect(response.text).toBe("Inscription réussie ! Bienvenue !");
    });



});


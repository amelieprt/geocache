import request from "supertest";
import { app } from "../routes";

describe("tester les routes liées au users routes.ts", () => {

    // verifier si app est défini
    test("app devrait être défini", () => {
        expect(app).toBeDefined();
    });

    // TODO  utiliser login & password pluttot que firstName, lastName
    // verifier la route login
    // success (l'utilisateur existe)
    // curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111"}'
    it("test si l'user existe dans la db avec un user existant.", async () => {
        const response = await request(app)
            .post("/login")
            .send({ "firstName": "xxxxxxx11111", "lastName": "yyyyy1111", "email": "zzzz111111" })
            .set("Accept", "application/json");
        // console.log(response.text);
        expect(response.statusCode).toBe(200);
    });


    // TODO  utiliser login & password pluttot que firstName, lastName
    // verifier la route login
    // success (l'utilisateur n'existe pas)
    // curl -X POST "http://localhost:3000/login" -H "Content-Type:application/json" -d '{"firstName": "lol", "lastName": "yyyyy1111", "email": "zzzz111111"}'
    it("test si l'user existe dans la db avec un user inxestant.", async () => {
        const response = await request(app)
            .post("/login")
            .send({ "firstName": "lol", "lastName": "yyyyy1111", "email": "zzzz111111" })
            .set("Accept", "application/json");
        // console.log(response.text);
        expect(response.statusCode).toBe(500);
    });

    // TODO : ajouter un test pour la route /user

});

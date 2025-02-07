import express from "express";
import request from "supertest";
import { app } from "../main";

// tester la route / avec une requête GET
describe("Test main.ts", () => {

    test("app devrait être défini", () => {
        expect(app).toBeDefined();
    });

    it(" GET / devrait retourner 'Hello word' avec le code 200", async () => {
        const response = await request(app).get("/");
        console.log(response.text);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Hello word"); // pour récupérer le texte envoyé par res.send
        // expect(response.body.super).toBe("Hello word"); // pour récupérer le texte envoyé par res.json
    });

    it(" GET /signup devrait retourner le code 201 (insertion avec succès)", async () => {
        const response = await request(app).get("/signup");
        console.log(response.text);
        expect(response.statusCode).toBe(201);
    });

});

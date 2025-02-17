
import request from "supertest";
import { app } from "../routes";

// Vérifier la route des cachettes

describe("tester les routes liées au cachettes routes.ts", () => {

    // // verifier la route /cachette
    // // success test (l'utilisateur n'existe pas)
    it("test créer une cachette", async () => {
        const response = await request(app)
            .post("/create-cachette")
            .send({
                nom: "test",
                description: "essai",
                longitude: 12,
                latitude: 1.2,
                difficulte: 0,
                mpd: "coucou"
            });

        expect(response.status).toBe(201);
    });


    it("test lire les cachette", async () => {
        const response = await request(app)
            .post("/read-cachette")
            .send({ nom: "test" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
    });

    it("test update les cachette", async () => {
        const response = await request(app)
            .post("/update-cachette")
            .send({ nom: "test", description: "test", longitude: 333, latitude: 333, difficulte: 3, mdp: "test" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
    });
    it("test delete les cachette", async () => {
        const response = await request(app)
            .post("/delete-cachette")
            .send({ nom: "test" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
    });
    it("test read les cachette", async () => {
        const response = await request(app)
            .post("/read-cachette")
            .send({ nom: "test", description: "test", longitude: 333, latitude: 333, difficulte: 3, mdp: "test" })
            .set("Accept", "application/json");
        expect(response.statusCode).toBe(200);
    });

});
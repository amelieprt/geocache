import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;


app.get("/", (req, res) => {
    res.status(200);
    // res.json({ "super": "Hello word" }); // testé avec response.body.super
    res.send("Hello word"); // testé avec response.text
});

app.get("/signup", async (req, res) => {
    // créer ou utiliser une table d'utilisateurs dans ma_nouvelle_bdd

    // connexion à la bd
    mongoose.connect("mongodb://localhost:27017/ma_nouvelle_bdd");
    console.log("Connected to MongoDB");

    // Define the User schema and model
    const userSchema = new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    });
    const User = mongoose.model("User", userSchema);

    console.log("User model created");

    try {
        // const user = new User(req.body);
        const user = new User({ firstName: "jp", lastName: "jp", email: "toto@gmail.com" });
        await user.save();
        res.status(201).json(user);
        console.log("User created");
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    } finally {
        mongoose.connection.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/signup`);
});

export { app, port };

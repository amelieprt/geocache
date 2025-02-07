import { add } from "../server";

let bestscore = 100;
console.log("adding 10 to best score", add(bestscore, 10));

describe("Test server.ts", () => {
    test("adds two numbers", () => {
        expect(add(1, 2)).toBe(3);
    });
});


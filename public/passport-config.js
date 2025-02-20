"use strict";
// import passport from 'passport';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { Request, Response, NextFunction } from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
// const secretKey = process.env.JWT_SECRET;
// if (!secretKey) {
//     throw new Error("La clé secrète JWT n'est pas définie !");
// }
// const opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: secretKey
// };
// passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//     // Vous pouvez ajouter ici la logique pour récupérer l'utilisateur à partir du payload JWT
//     // Par exemple, si vous avez une fonction getUserById pour récupérer l'utilisateur par ID
//     getUserById(jwt_payload.id)
//         .then(user => {
//             if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//             }
//         })
//         .catch(err => done(err, false));
// }));
// export const initializePassport = () => {
//     passport.initialize();
// };
// export const authenticateJwt = passport.authenticate('jwt', { session: false });
// function getUserById(id: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//         // Simulate database call
//         const user = { id: id, username: 'amelieprt' };
//         if (user) {
//             resolve(user);
//         } else {
//             reject('User not found');
//         }
//     });
// }

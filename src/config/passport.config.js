const passport = require('passport')

const GithubStrategy = require('passport-github2')
const configObject = require('./index.js')
const jwt = require('passport-jwt')
const { userClass } = require('../daos/index.js')

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const userService = new userClass();

const initializePassport = () => {

    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies["token"]
        }
        return token;
    }

    passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: configObject.jwt_code,
        },
        async (jwt_payload, done) => {
            try {

                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        },
    ),
    );

    passport.use("github", new GithubStrategy(
        {
            clientID: configObject.gh_client_id,
            clientSecret: configObject.gh_client_secret,
            callbackURL: `http://localhost:${configObject.port}/api/sessions/githubcallback`,
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                let user = await userService.getUserByMail(profile._json.email);
                if (!user) {
                    // para registrar en caso de que no exista
                    let userNew = {
                        first_name: profile.username,
                        last_name: profile.username,
                        email: profile._json.email,
                        password: " "
                    };
                    let result = await userService.createUser(userNew);
                    return done(null, result);
                }
                done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
    );

};

module.exports = initializePassport;

const passport = require('passport')
const userDaoMongo = require('../daos/mongo/userDaoMongo.js')
const userService = new userDaoMongo()
const GithubStrategy = require('passport-github2')

exports.initializePassport = () => {

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.89e297da0de35b33',
        clientSecret: 'ea5a9ae2945796ffb01eb824c56f8dee4520f0f9',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=>{
        try{
            console.log(profile)
            let user = await userService.getUserBy({email: profile._json.email})
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile._json.email,
                    password: '123'
                }
                let result = await userService.createUser(newUser)
                return done(null, result)
            }
            done(null, user)
        }catch(err){
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserBy({_id: id})
        done(null, user)
    })

}
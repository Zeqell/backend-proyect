const { Router } = require('express') 
const passport = require('passport') 

const handleResponses = require('../../middleware/handleResp.js') 
const { handleAuthFront } = require('../../middleware/handlePasp.js') 
const SessionsController = require('../../controllers/sessions.controller.js') 

const router = Router();
const sControl = new SessionsController();

// http://localhost:PORT/api/sessions/
router.post('/register', sControl.register);
router.post('/login', sControl.login);
router.post('/loginSession', sControl.loginSession);
router.get ('/logout', sControl.logout);

// GITHUB API
router.get('/github', passport.authenticate('github', {scope:['user:email']}), sControl.github)
router.get('/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/'}), sControl.githubcallback)

// TODO Pruebas
router.get('/current', handleAuthFront(['USER']), sControl.pruebasCurrent)

module.exports = router;
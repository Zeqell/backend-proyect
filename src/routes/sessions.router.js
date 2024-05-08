const { Router } = require('express')
const passport = require('passport')
const { passportCall } = require('../helpers/jwt/passportCall.middleware.js')
const { authorization } = require('../helpers/jwt/authorization.middleware.js')
const SessionController = require('../controllers/sessions.controller.js')
const { isAuthenticated } = require('../middleware/handlePasp.js')
const { upload, uploadFields } = require('../util/multer.js')
const { isAdmin } = require('../middleware/roleVerification.js')

const router = Router()

const {
    register,
    login,
    logout,
    current,
    github,
    githubCallback,
    toggleUserRole,
    user,
    uploadsMulter,
    uploadsMulterView,
    getAllUsers,
    deleteInactiveUsers,
    verifyToken
} = new SessionController()


router.post('/register', register)

router.post('/login', login)

router.get('/logout', logout)

router.get('/current', [passportCall('jwt'), authorization(['ADMIN', 'PUBLIC'])], current)

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), github)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), githubCallback)

router.get('/protected-route', isAuthenticated, (req, res) => {
    res.json({ message: 'Protected route' })
})
router.put('/premium/:uid', toggleUserRole)

router.post('/:uid/documents', uploadFields, uploadsMulter)

router.get('/:uid/upload-files', uploadsMulterView)

router.get('/', isAdmin, getAllUsers)

router.delete('/', isAdmin, deleteInactiveUsers)

router.get('/verify', verifyToken)

router.get('/user/:uid', user)


module.exports = router
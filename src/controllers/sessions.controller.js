const { createHash, isValidPassword } = require('../util/passwords.js')
const { generateToken } = require('../util/createToken.js')
const { cartService, userService } = require('../repositories/service.js')
const { logger } = require('../util/logger.js')
// const multer = require('multer')
// const {upload} = require('../util/multer.js')
// const {sendMail} = require('../util/sendMail.js')
const jwt = require('jsonwebtoken')
const { jwt_code } = require('../config/index.js')

class SessionController {
    constructor(){
        this.cartService = cartService
        this.userService = userService
    }

    register = async (req,res) =>{
        const { first_name, last_name, date, email, password, role} = req.body
        console.log(first_name, last_name, date, email, password)
    
        if(first_name === '' || last_name === '' || email === '' || password === '') {
            return res.send('Todos los campos deben ser obligatorios')
        }
        
        try {
            const existingUser = await this.userService.getUserBy({email})
    
            logger.info(existingUser)
            if (existingUser) {
                return res.send({ status: 'error', error: 'Este usuario ya existe' })
            }
    
            const cart = await this.cartService.createCart()

            const hashedPassword = createHash(password)
    
            const newUser = {
                first_name,
                last_name,
                date,
                email,
                password: hashedPassword,
                cart: cart._id,
                role,
            }
            const result = await this.userService.createUser(newUser)

            req.session.user = {
                id: result._id,
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email,
                cart: result.cart,
                role: result.role
            }
    
            const token = generateToken({
                id: result._id,
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email,
                cart: result.cart,
                role: result.role
            })
            res.cookie('token', token, {
                maxAge: 60*60*1000*24,
                httpOnly: false,
            }).send({
                status: 'success',
                payload: {
                    id: result._id,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    email: result.email,
                    role: result.role,
                    cart: result.cart,
                    token: token
                }
            })
        } catch (error) {
            logger.error('Error durante el registro de usuario:', error)
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' })
        }
    }

    login = async (req,res) => {
        const { email, password } = req.body
    
        if(email === '' || password === '') {
            return res.send('Todos los campos deben ser obligatorios')
        }
    
        try{
            const user = await this.userService.getUserBy({ email })
            console.log(user)
            if(user.email === 'adminCoder@coder.com' && password === user.password){
    
                await this.userService.updateRole(user._id, 'admin')
                req.session.user = {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: 'admin'
                }
                const token = generateToken({
                    id: user._id,
                    role: user.role
                })
    
                res.cookie('token', token, {
                    maxAge: 60*60*1000*24,
                    httpOnly: false,
                }).redirect('/products')
            }
            else{
    
                if (!user) {
                    return res.send('correo electrónico o contraseña no válida')
                }
    
                if (!isValidPassword(password, { password: user.password })) {
                    return res.send('correo electrónico o contraseña no válida')
                }

                user.last_connection = new Date()
                await user.save()
    
                req.session.user = {
                    user: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    cart: user.cart,
                    role: user.role
                }
    
                const token = generateToken({
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    cart: user.cart,
                    role: user.role
                })
    
                res.cookie('token', token, {
                    maxAge: 60*60*1000*24,
                    httpOnly: false,
                }).send({
                    status: 'success',
                    payload: {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        cart: user.cart,
                        role: user.role,
                        token: token
                    }
                })
            }
    
        } catch(error) {
            logger.error('Error durante el inicio de sesión:', error)
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' })
        }
    }

    logout = async (req,res) =>{
        try{
            const user = req.session.user

            if (user) {
                const dbUser = await this.userService.getUserBy({ _id: user.user })
                if (dbUser) {
                    dbUser.last_connection = new Date()
                    await dbUser.save()
                }
            }
            req.session.destroy((err) =>{
                if(err){
                    logger.error('Error durante la destrucción de la sesión:', err)
                    return res.status(500).send({ status: 'error', error: 'Error interno del servidor' })
                }
                console.log("Logout successfully")
                res.redirect('/login')
            })
        }catch(error) {
            logger.error('Error al cerrar sesión:', error)
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' })
        }
    }

    current = (req,res) => {
        if (req.user) {
            const { first_name, last_name, role } = req.user
            const userDTO = {
                first_name: first_name,
                last_name: last_name,
                role: role
            }
            res.json(userDTO)
        } else {
            res.status(401).json({ error: "No autorizado" })
        }
    }

    github = async (req,res)=>{}

    githubCallback = (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
    }

    toggleUserRole = async (req, res, next) => {
        try {
            const { uid } = req.params
            console.log("---------------------",uid)
            const user = await this.userService.getUserBy({_id: uid})
            console.log('user: ', user)
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' })
            }

            if (user.role === 'premium') {
                user.role = 'user'
                await user.save()
                return res.status(200).json({ message: 'Rol de usuario actualizado al usuario' })
            }
    
            const documentCount = user.documents.length
            if (documentCount >= 3) {
                if (user.role != 'premium') {
                    user.role = 'premium'
                    await user.save()
    
                    return res.status(200).json({ message: 'El rol de usuario cambió a premium' })
                } else {
                    return res.status(200).json({ message: 'El usuario ya es premium' })
                }
            } else {
                return res.status(400).json({ message: 'El usuario no ha subido suficientes documentos para cambiar el rol a premium' })
            }

        } catch (error) {
            next(error)
        }
    }

    user = async (req, res, next) => {
        try {
            const uid = req.params.uid
            console.log("=======", uid)
            const user = await this.userService.getUserBy({_id: uid})
            console.log(user)
            res.json({payload: user})
        } catch (error){
            next(error)
        }
    }

    uploadsMulter = async (req, res) => {
        try {
            const uid = req.params.uid
            const files = req.files

    
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No se subieron archivos' })
            }

            const user = await this.userService.getUserBy({ _id: uid })
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' })
            }
    
            const documents = []

            for (const [fieldName, fileArray] of Object.entries(files)) {
                fileArray.forEach(file => {
                    documents.push({
                        name: file.originalname,
                        reference: file.path,
                    })
                })
            }
    
            user.documents = user.documents.concat(documents)
    
            await user.save()
    
            res.status(200).json({
                message: 'Documentos subidos con éxito',
                documents: documents.map(doc => ({
                    name: doc.name,
                    reference: doc.reference,
                })),
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    uploadsMulterView = async (req, res) => {
        try {
            const uid = req.params.uid
    
            res.render('uploadFiles', { uid })
        } catch (error) {
            console.error('Error al mostrar la vista de archivos cargados:', error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getUsers()

            const userList = users.map(user => ({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }))

            res.json({ status: 'success', payload: userList })
        } catch (error) {
            console.error('Error al recuperar usuarios:', error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    deleteInactiveUsers = async (req, res) => {
        try {
            const now = new Date()
            const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))

            const inactiveUsers = await this.userService.findInactiveUsers(twoDaysAgo)
            
            if (inactiveUsers.length === 0) {
                return res.status(200).json({ message: 'No se encontraron usuarios inactivos' })
            }
            
            for (const user of inactiveUsers) {
                await this.userService.deleteUser(user._id)
                
                const subject = 'Cuenta eliminada por inactividad'
                const html = `
                    <div>
                        <h2>Hola ${user.first_name},</h2>
                        <p>Su cuenta ha sido eliminada debido a inactividad de dos o más días. ¡Si tiene alguna pregunta, por favor contáctenos!.</p>
                    </div>`
                await sendEmail(user.email, subject, html)
            }
            
            res.status(200).json({ message: `Removed ${inactiveUsers.length} inactive users` })
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

    verifyToken = async (req, res) => {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ message: 'No autorizado: no se encontró ningún token' });
        }
        
        jwt.verify(token, jwt_code, async (err, decodedUser) => {
            if (err) {
                return res.status(401).json({ message: 'No autorizado: token no válido' });
            }
            
            const userFound = await this.userService.getUserBy({ _id: decodedUser.id });
            if (!userFound) {
                return res.status(401).json({ message: 'No autorizado: Usuario no encontrado' });
            }
            
            res.json({
                status: 'success',
                payload: {
                    id: userFound._id,
                    first_name: userFound.first_name,
                    last_name: userFound.last_name,
                    email: userFound.email,
                    role: userFound.role
                }
            });
        });
    };

}

module.exports = SessionController
const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../server.js')
const SessionController = require('../controllers/sessions.controller.js')
const { userDaoMongo } = require('../daos/mongo/userDaoMongo.js')


chai.use(chaiHttp)
const expect = chai.expect

describe('SessionController', () => {
    let sessionController
    before(() => {
        sessionController = new SessionController()
    })
    describe('register', () => {
        it('Debería registrar un nuevo usuario.', (done) => {
            const newUser = {
                first_name: 'Robert',
                last_name: 'Noir',
                date: '1992-04-05',
                email: 'robert.noir@example.com',
                password: 'password',
                role: 'user'
            }
            chai.request(app)
                .post('/register')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('status').equal('success')
                    expect(res.body.payload).to.have.property('email').equal(newUser.email)
                    done()
                })
        })
    })
    describe('login', () => {
        it('Debe iniciar sesión un usuario existente', (done) => {
            const existingUser = {
                email: 'robert.noir@example.com',
                password: 'password'
            }
            chai.request(app)
                .post('/login')
                .send(existingUser)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res).to.have.cookie('token') 
                    done()
                })
        })
    })
})
describe('Test userDao', ()=>{
    before(function() {
        this.userDao = new userDaoMongo()
    })
    beforeEach(function(){
        this.timeout(2000)
    })
    it('Dao debe obtener un array de todos los usuarios.', async function(){
        const response = await this.userDao.get({})
        expect(response).to.not.be.equal([])
    })
})
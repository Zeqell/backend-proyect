const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const app = require('../server.js')
const { CartController } = require('../controllers/cart.controller.js')


describe('Cart Tests', () => {
    it('Debería recibir todos los carts', (done) => {
        chai.request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('array')
                done()
            })
    })
    it('Debería crear un nuevo carrito', (done) => {
        chai.request(app)
            .post('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })
    it('Debería obtener un carrito por ID', (done) => {
        const existingCartId = 'existingCartId'
        chai.request(app)
            .get(`/api/carts/${existingCartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })
    it('Debería agregar un producto al carrito', (done) => {
        const existingCartId = 'existingCartId'
        const existingProductId = 'existingProductId'
        chai.request(app)
            .put(`/api/carts/${existingCartId}/product/${existingProductId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })
    it('Debe eliminar un producto del carrito', (done) => {
        const existingCartId = 'existingCartId'
        const existingProductId = 'existingProductId'
        chai.request(app)
            .delete(`/api/carts/${existingCartId}/product/${existingProductId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                done()
            })
    })
})
describe('Cart Controller Tests', () => {
    it('Debería crear un nuevo carrito', async () => {
        const cartController = new CartController()
        const newCart = await cartController.createCart()
        expect(newCart).to.be.an('object')
    })
})
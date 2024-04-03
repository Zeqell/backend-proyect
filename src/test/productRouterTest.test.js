const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const app = require('../server.js')
const { productDaoMongo } = require('../daos/mongo/productsDaoMongo.js')
const { ProdcutsController } = require('../controllers/products.controller.js')


describe('Product  Tests', () => {
    it('Debería recibir todos los productos.', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('array')
                done()
            })
    })
    it('Debería agregar un nuevo producto', (done) => {
        chai.request(app)
            .post('/api/products')
            .send({
                title: 'Nuevo Producto',
                description: 'Descripcion nuevo producto',
                price: 10,
                thumbnail: 'thumbnail-url',
                code: 'pro123',
                stock: 100,
                status: 'active',
                category: 'nueva-categoria'
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.message).to.equal('Product added successfully')
                done()
            })
    })
    it('Debería obtener un producto por ID', (done) => {
        const existingProductId = 'existingProductId'
        chai.request(app)
            .get(`/api/products/${existingProductId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })
})

describe('Product Controller Tests', () => {
    it('Debería agregar un nuevo producto', async () => {
        const newProductData = {
            title: 'nuevo producto',
            description: 'Descripcion nuevo producto',
            price: 10,
            thumbnail: 'thumbnail-url',
            code: 'pro123',
            stock: 100,
            status: 'active',
            category: 'nueva-categoria'
        }
        const productsController = new ProdcutsController()
        await productsController.addProduct(newProductData)
        const addedProduct = await productDaoMongo.getById(newProductData.code)
        expect(addedProduct).to.not.be.null
        expect(addedProduct.title).to.equal(newProductData.title)
    })
})
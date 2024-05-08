const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const app = require('../app')
const { productDaoMongo } = require('../daos/mongo/productsDaoMongo')
const { ProdcutsController } = require('../controllers/products.controller')


describe('Pruebas de enrutador de productos', () => {

    it('Debería recibir todos los productos', (done) => {
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
                title: 'New Product',
                description: 'Description of the new product',
                price: 10,
                thumbnail: 'thumbnail-url',
                code: 'poi123',
                stock: 100,
                status: 'active',
                category: 'new-category'
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.message).to.equal('Producto agregado exitosamente')
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


describe('Pruebas del controlador de producto', () => {
    it('Debería agregar un nuevo producto', async () => {
        const newProductData = {
            title: 'New Product',
            description: 'Description of the new product',
            price: 10,
            thumbnail: 'thumbnail-url',
            code: 'poi123',
            stock: 100,
            status: 'active',
            category: 'new-category'
        }

        const productsController = new ProdcutsController()

        await productsController.addProduct(newProductData)

        const addedProduct = await productDaoMongo.getById(newProductData.code)
        expect(addedProduct).to.not.be.null
        expect(addedProduct.title).to.equal(newProductData.title)

    })
})
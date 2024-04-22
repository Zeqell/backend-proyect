const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:4000')


describe('Product  Tests', () => {
    describe('Test de Productos', ()=>{
        it('Debe agregar un nuevo producto.', async () => {
            const productMock = {
                title: '4 Nuevo Producto',
                description: 'Descripcion de 4 nuevo producto',
                price: 10,
                thumbnail: 'thumbnail-url',
                code: 'pro123456',
                stock: 100,
                status: true,
                category: '4-nueva-categoria'
            }
            const {statusCode,_body} = await requester.post('/api/products').send(productMock)
            expect(statusCode).to.be.equal(200)
            expect(_body.status).to.be.equal('success')
        })
        it('Debe devolver todos los productos', async ()=>{
            const { statusCode, _body,ok } = await requester.get('/api/products')
            expect(statusCode).to.be.equal(200)
            expect(_body.payload).to.be.an('object')
            expect(ok).to.be.equal(true)
        })
        // it('Debe devolver productos por ID', async ()=>{
        //     let pid = '66156d2726bb6d51e9b473ed'
        //     const response = await requester.get(`/api/products/${pid}`)
        //     expect(response.statusCode).to.eq(200)
        //     expect(response._body.payload).to.be.an('object')
            
            
        // } )
    })
//     it('Debería agregar un nuevo producto', (done) => {
//         chai.request(app)
//             .post('/api/products')
//             .send({
//                 title: 'Nuevo Producto',
//                 description: 'Descripcion nuevo producto',
//                 price: 10,
//                 thumbnail: 'thumbnail-url',
//                 code: 'pro123',
//                 stock: 100,
//                 status: 'active',
//                 category: 'nueva-categoria'
//             })
//             .end((err, res) => {
//                 expect(res).to.have.status(200)
//                 expect(res.body.status).to.be.equal('success')
//                 expect(res.body.message).to.be.equal('Product added successfully')
//                 done()
//             })
//     })
//     it('Debería obtener un producto por ID', (done) => {
//         const existingProductId = 'existingProductId'
//         chai.request(app)
//             .get(`/api/products/${existingProductId}`)
//             .end((err, res) => {
//                 expect(res).to.have.status(200)
//                 expect(res.body.status).to.be.equal('success')
//                 expect(res.body.payload).to.be.an('object')
//                 done()
//             })
//     })
// })

// describe('Product Controller Tests', () => {
//     it('Debería agregar un nuevo producto', async () => {
//         const newProductData = {
//             title: 'nuevo producto',
//             description: 'Descripcion nuevo producto',
//             price: 10,
//             thumbnail: 'thumbnail-url',
//             code: 'pro123',
//             stock: 100,
//             status: 'active',
//             category: 'nueva-categoria'
//         }
//         const productsController = new ProdcutsController()
//         await productsController.addProduct(newProductData)
//         const addedProduct = await productDaoMongo.getById(newProductData.code)
//         expect(addedProduct).to.not.be.null
//         expect(addedProduct.title).to.be.equal(newProductData.title)
//     })
})
const { Router } = require('express')
const { generateProducts } = require('../../pruebas/pruebas.js')
// const { warn } = require('winston')
const { faker } = require('@faker-js/faker')


const router = Router()

router.get('/mockproducts', (req, res) =>{

    let products = []

    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    res.json({
        status: 'success',
        payload: products
    })
})

router.get('/logger', (req, res) =>{
    //req.logger.warning('alerta esto es un warning en el endpoint de pruebas/logger');
    //req.logger.error('alerta esto es un error en el endpoint de pruebas/logger');
    req.logger.fatal('alerta esto es un error en el endpoint de pruebas/logger');
    res.send('logger')
})

// artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/simple" -o simple.json
// artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/compleja" -o compleja.json

router.get('/simple', (req, res)=>{
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
        sum += i        
    }
    res.send(`la suma es ${sum}`)
})

router.get('/compleja', (req, res)=>{
    let sum = 0
    for (let i = 0; i < 5e8; i++) {
        sum += i        
    }
    res.send(`la suma es ${sum}`)
})


// artillery run config.yaml --output testPerformance.json

// artillery report testPerformance.json -o testResults.html

router.get('/test/user', (req, res)=>{
    let first_name = faker.person.firstName()
    let last_name = faker.person.lastName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let date = faker.date.bithdate()
    let role = faker.person.jobArea()
    res.send({
        first_name,
        last_name,
        email,
        password,
        date,
        role
    })
})

module.exports = router
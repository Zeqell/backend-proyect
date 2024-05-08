const { Router } = require('express')
const { configObject } = require('../config/index')
const stripe = require('stripe')(configObject.stripe_secret_key)

const router = Router()

router.post('/create-checkout-session', async (req, res) =>{
    const { user, products } = req.body

    console.log("usersss: ", user)
    console.log("productssss: ", products)

    const lineItems = products.map((cartItem) => {
        const { quantity } = cartItem;
        const product = cartItem[0];

        console.log(product)

        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.title,
                    
                },
                unit_amount: product.price * 100
            },
            quantity,
        };
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:5173/success`,
            cancel_url: 'http://localhost:5173/cart',
            customer_email: user.email,
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error al crear la sesión de pago:', error);
        res.status(500).json({ message: 'Error al crear la sesión de pago' });
    }
})


module.exports = router
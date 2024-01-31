const configObject = require('../config/index.js')
const { Router } = require('express')
const { productClass } = require('../daos/index.js')

const handleResponses = require('../middleware/handleResp.js')
const { handleAuthFront } = require('../middleware/handlePasp.js')
const  {renderPage}  = require('../helpers/responses.js')

const router = Router();

// * GET http://localhost:PORT/ (login)
const productsMongo = new productClass();
router.get("/", handleAuthFront(['PUBLIC']), handleResponses, (req, res) => {
    try {
        if (req.user) return res.redirect('/products')
        res.renderPage("login", "Login");
    } catch (error) {
        console.error(error);
        res.renderPage("error", "Error", { message: "Ocurrio un error, vuelva a intentarlo" });
    }
});

// * GET http://localhost:PORT/register
router.get("/register", handleAuthFront(['PUBLIC']), handleResponses, (req, res) => {
    try {
        if (req.user) return res.redirect('/products')
        res.renderPage("register", "Nuevo Registro");
    } catch (error) {
        console.error(error);
        res.renderPage("error", "Error", { message: "Ocurrio un error, vuelva a intentarlo" });
    }
});

// * GET http://localhost:PORT/products
router.get("/products", handleAuthFront(['PUBLIC']), handleResponses, async (req, res) => {
    try {
        // handle url API products
        const {
            page = 1,
            sort,
            category: initialCategory,
            availability = true,
        } = req.query;
        const category = initialCategory === "all" ? null : initialCategory;
        const apiUrl = new URL(`http://localhost:${configObject.port}/api/products`);
        apiUrl.searchParams.set("page", page);
        apiUrl.searchParams.set("limit", "5");
        if (sort) apiUrl.searchParams.set("sort", sort);
        if (category) apiUrl.searchParams.set("category", category);
        if (availability) apiUrl.searchParams.set("availability", availability);

        const data = await (await fetch(apiUrl)).json();

        if (
            data.error ||
            Number(page) > Number(data.data.totalPages) ||
            Number(page) < 0
        ) {
            return res.renderPage("products", "Productos", { productError: true });
        }

        // update product
        const product = data.data.docs.map((prd) => ({
            ...prd,
            price: prd.price.toLocaleString("es-ES", { style: "decimal" }),
            unavailability: prd.stock === 0,
            link: `/products/${prd._id}`,
        }));

        const filterUrl = (filter) => {
            const params = new URLSearchParams(req.url.split("?")[1] || "");
            params.delete(filter);
            params.delete("page");
            return `/products?${params}`;
        };

        res.renderPageEstruc("products", "Producctos",{
            control: {
                productError: false,
            },
            arrays: {
                product,
                category: await productsMongo.getCategorys(),
            },
            pageControl: {
                page: data.data.page,
                totalPages: data.data.totalPages,
                hasPrevPage: data.data.hasPrevPage,
                hasNextPage: data.data.hasNextPage,
                prevLink: filterUrl("page") + data.data.prevLink,
                nextLink: filterUrl("page") + data.data.nextLink,
                ascend: filterUrl("sort") + "&sort=asc",
                descend: filterUrl("sort") + "&sort=desc",
                disorderly: filterUrl("sort") + "&sort=disorderly",
                availability: filterUrl("availability") + "&availability=false",
                unavailability: filterUrl("availability") + "&availability=true",
                url: filterUrl("category"),
            },
        });
    } catch (error) {
        console.error(error);
        res.renderPage("error", "Error", { message: "Ocurrio un error, vuelva a intentarlo" });
    }
});

// * GET http://localhost:PORT/products/:id
router.get("/products/:pid", handleAuthFront(['PUBLIC']), handleResponses, async (req, res) => {
    try {
        const { pid } = req.params;
        const apiUrl = `http://localhost:${configObject.port}/api/products/${pid}`;

        const { error, data } = await (await fetch(apiUrl)).json();

        res.renderPageEstruc("product", "Producto",
            {
                control: {
                    productError: error,
                },
                arrays: {
                    product: data,
                },
            }
        );

    } catch (error) {
        console.error(error);
        res.renderPage("error", "Error", { message: "Ocurrio un error, vuelva a intentarlo" });
    }
});

// ? GET http://localhost:PORT/cart // RE HACIENDO
router.get("/cart", handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, (req, res) => res.renderPage("cart", "Carrito")); // RE HACIENDO

// ? GET http://localhost:PORT/realTimeProducts // RE HACIENDO
router.get("/realTimeProducts", handleAuthFront(['USER_PREMIUM']), handleResponses, (req, res) => res.renderPage("realTimeProducts", "Productos en tiempo real"));

// ? GET http://localhost:PORT/chat // RE HACIENDO
router.get("/chat", handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, (req, res) => res.renderPage("chat", "Chat")); // RE HACIENDO

module.exports = router;
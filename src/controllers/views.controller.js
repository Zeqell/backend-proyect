const configObject = require('../config/index.js') 
const { ProductClass } = require('../daos/index.js') 
const CustomError = require('../util/err.js') 

const productsService = new ProductClass()

class ViewsController {
    constructor() { }

    login = (req, res) => {
        try {
            if (req.user) return res.redirect('/products')
            res.renderPage("login", "Login");
        } catch (error) {
            res.renderError(error);
        }
    }

    register = (req, res) => {
        try {
            if (req.user) return res.redirect('/products')
            res.renderPage("register", "Nuevo Registro");
        } catch (error) {
            res.renderError(error);
        }
    }

    products = async (req, res) => {
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

            res.renderPageEstruc("products", "Productos", {
                control: {
                    productError: false,
                },
                arrays: {
                    product,
                    category: await productsService.getCategorys(),
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
            res.renderError(error);
        }
    }

    productById = async (req, res) => {
        try {
            const { pid } = req.params;
            const apiUrl = `http://localhost:${configObject.port}/api/products/${pid}`;

            const resp = await (await fetch(apiUrl)).json();
            //console.log("resp: ",resp);
            //console.log("user: ",req.user);
            const { isError, data } = resp

            res.renderPageEstruc("product", "Producto",
                {
                    control: {
                        productError: isError,
                    },
                    arrays: {
                        product: data,
                    },
                }
            );

        } catch (error) {
            res.renderError(error);
        }
    }

    cart = async (req, res) => {
        try {
            const cart = req.user.userCart;

            let resp = await fetch(`http://localhost:${configObject.port}/api/carts/${cart}`);
            const products = (await resp.json()).data.products;

            products.forEach(product => product.total = product.product.price * product.quantity);

            const objectRender = {
                cartError: false,
                cartId: cart,
                cartNoEmpty: products.length !== 0,
                products: products.length !== 0 ? products : undefined
            };
            res.renderPage('cart', 'Carrito', objectRender);
        } catch (error) {
            res.renderError('Hubo un problema al cargar el carrito', error);
        }
    };

    realTimeProducts = async (req, res) => {
        try {
            const apiUrl = `http://localhost:${configObject.port}/api/products?limit=100`;
            const resp = (await (await fetch(apiUrl)).json()).data.docs;
            //console.log('resp: ',resp);
            const product = resp.map((prd) => ({
                ...prd,
                price: prd.price.toLocaleString('es-ES', { style: 'decimal' }),
            }));

            res.renderPageEstruc('realTimeProducts', 'Productos en tiempo Real', {}, {
                product,
                cssPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`,
            });
        } catch (error) {
            res.renderError('Hubo un problema al cargar los productos', error);
        }
    }

    chat = async (req, res) => res.renderPage('chat', 'Chat');

    user = async (req, res) => {
        try {
            res.renderPageEstruc('user', 'Usuario')
        } catch (error) {
            res.renderError(error)
        }
    }
}
module.exports = ViewsController;
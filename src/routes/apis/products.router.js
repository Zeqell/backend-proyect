const { Router } = require('express') 
const { productClass } = require('../../daos/index.js')
const { resCatchError, resError, resJson } = require('../../helpers/responses.js')
const CustomError = require('../../util/err.js') 

const router = Router();
const products = new productClass();

// GET http://localhost:PORT/api/products + ? limit, page, sort, query
router.get("/", async (req, res) => {
    try {
        let {
            limit = 10,
            page = 1,
            category,
            availability,
            sort,
            campo1,
            filtro1,
            campo2,
            filtro2,
            campo3,
            filtro3,
        } = req.query;

        const query = {
            ...(category && { category }),
            ...(availability == "true" && { availability: true }),
        };
        const options = {
            limit,
            page,
            ...(sort && { sort }),
        };

        if (campo1 && filtro1) query[campo1] = filtro1;
        if (campo2 && filtro2) query[campo2] = filtro2;
        if (campo3 && filtro3) query[campo3] = filtro3;

        const resp = await products.getProducts(query, options);

        const { prevPage, nextPage } = resp;
        const prevLink = prevPage ? `&page=${prevPage}` : "";
        const nextLink = nextPage ? `&page=${nextPage}` : "";

        resJson(res, 200, {
            ...resp,
            prevLink: prevLink,
            nextLink: nextLink,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof CustomError) {
            resCatchError(res, error);
        } else {
            resError(
                res,
                "An error occurred in the API request",
                500,
                "GET http://localhost:PORT/api/products",
            );
        }
    }
});

// GET http://localhost:PORT/api/products/:pid
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await products.getProductsById(pid);

        if (product) {
            resJson(res, 200, product);
        } else {
            resError(
                res,
                "Product not found",
                404,
                "GET http://localhost:PORT/api/products/:pid",
            );
        }
    } catch (error) {
        console.error(error);
        resError(
            res,
            "Internal Server Error",
            500,
            "GET http://localhost:PORT/api/products/:pid",
        );
    }
});

// POST http://localhost:PORT/api/products/ + body: whole product
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        const resp = await products.addProduct(newProduct);
        resJson(res, 200, resp);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            resCatchError(res, error);
        } else {
            console.error(error);
            resError(
                res,
                "Internal Server Error",
                500,
                "GET http://localhost:PORT/api/products/:pid",
            );
        }
    }
});

// PUT http://localhost:PORT/api/products/:pid + body: whole product
router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const changedProduct = req.body;

        const resp = await products.updateProduct(pid, changedProduct);

        if (resp) {
            resJson(res, 200, resp);
        } else {
            resError(
                res,
                "Code not found",
                204,
                "PUT http://localhost:PORT/api/products/:pid",
                false,
            );
        }
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            resCatchError(res, error);
        } else {
            resError(
                res,
                "Internal Server Error",
                500,
                "PUT http://localhost:PORT/api/products/:pid",
            );
        }
    }
});

// DELETE http://localhost:PORT/api/products/:pid
router.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const resp = await products.deleteProductById(pid);

        if (resp) {
            resJson(res, 200, resp);
        } else {
            resError(
                res,
                "Id not found",
                204,
                "DELETE http://localhost:PORT/api/products/:pid",
                false,
            );
        }
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            resCatchError(res, error);
        } else {
            resError(
                res,
                "Internal Server Error",
                500,
                "DELETE http://localhost:PORT/api/products/:pid",
            );
        }
    }
});

// DELETE http://localhost:PORT/api/products?code=x
router.delete("/", async (req, res) => {
    try {
        const pcode = req.query.code;

        const resp = await products.deleteProductByCode(pcode);

        if (resp) {
            resJson(res, 200, resp);
        } else {
            resError(
                res,
                "Code not found",
                204,
                "DELETE http://localhost:PORT/api/products/:pid",
                false,
            );
        }
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            resCatchError(res, error);
        } else {
            resError(
                res,
                "Internal Server Error",
                500,
                "DELETE http://localhost:PORT/api/products/:pid",
            );
        }
    }
});

// GET http://localhost:PORT/api/products/group/categorys
router.get("/group/categorys", async (req, res) => {
    try {
        const resp = await products.getCategorys();
        resJson(res, 200, resp);
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            resCatchError(res, error);
        } else {
            resError(
                res,
                "An error occurred in the API request",
                500,
                "GET http://localhost:PORT/api/products",
            );
        }
    }
});

module.exports = router;
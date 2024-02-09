const { ProductClass } = require ('../daos/index.js') 
const { convertSort, convertAvailability, checkCategory } = require ('../helpers/mongoHelper.js')
const validateFields = require ('../util/validate.js')

class ProductsController {
    constructor() {
        this.service = new ProductClass();
    };

    getProducts = async (req, res) => {
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
                ...(await checkCategory(category) && { category: category }),
                ...convertAvailability(availability),
            };
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: convertSort(sort, "price"),
            };

            if (campo1 && filtro1) query[campo1] = filtro1;
            if (campo2 && filtro2) query[campo2] = filtro2;
            if (campo3 && filtro3) query[campo3] = filtro3;

            const resp = await this.service.getProducts(query, options);

            const { prevPage, nextPage } = resp;
            const prevLink = prevPage ? `&page=${prevPage}` : "";
            const nextLink = nextPage ? `&page=${nextPage}` : "";

            res.sendSuccess({
                ...resp,
                prevLink: prevLink,
                nextLink: nextLink,
            });
        } catch (error) {
            res.sendCatchError(error, "An error occurred in the API request");
        }
    };


    getProductsById = async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await this.service.getProductsById(pid);
            res.sendSuccessOrNotFound(product, "Id")
        } catch (error) {
            res.sendCatchError(error)
        }
    };

    createProduct = async (req, res) => {
        const fields = req.body;

        const requiredFields = [
            "title",
            "description",
            "code",
            "price",
            "stock",
            "status",
            "category",
            "thumbnail",
        ];

        try {
            const newProduct = validateFields(fields, requiredFields);
            const product = await this.service.addProduct(newProduct);
            res.sendSuccess(product);
        } catch (error) {
            res.sendCatchError(error)
        }
    };

    updateProductById = async (req, res) => {
        try {
            const pid = req.params.pid;
            const changedProduct = req.body;
            const product = await this.service.updateProduct(pid, changedProduct);
            res.sendSuccessOrNotFound(product, "Id")
        } catch (error) {
            res.sendCatchError(error)
        }
    };

    deleteProductById = async (req, res) => {
        try {
            const pid = req.params.pid;
            const product = await this.service.deleteProductById(pid);
            res.sendSuccessOrNotFound(product, "Id")
        } catch (error) {
            res.sendCatchError(error)
        }
    };

    deleteProductByCode = async (req, res) => {
        try {
            const pcode = req.query.code;
            const product = await this.service.deleteProductByCode(pcode);
            res.sendSuccessOrNotFound(product, "Code")
        } catch (error) {
            res.sendCatchError(error)
        }
    };

    getCategorys = async (req, res) => {
        try {
            const categorys = await this.service.getCategorys();
            res.sendSuccessOrNotFound(categorys, "Categorys")
        } catch (error) {
            res.sendCatchError(error)
        }
    };
}

module.exports = ProductsController;
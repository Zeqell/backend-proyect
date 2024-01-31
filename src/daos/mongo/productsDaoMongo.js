const CustomError = require('../../util/err.js') 
const validateFields = require('../../util/validate.js') 
const productModel = require('./models/products.model.js') 

class productDaoMongo {
    constructor() {
        this.model = productModel;
    }

    getProducts = async (reqQuery, reqOptions) => {
        try {
            if (!reqQuery || typeof reqQuery !== "object") {
                throw new CustomError(
                    'The "query" parameter is invalid',
                    400,
                    "getProducts",
                );
            }
            if (!reqOptions || typeof reqOptions !== "object") {
                throw new CustomError(
                    'The "options" parameter is invalid',
                    400,
                    "getProducts",
                );
            }

            const query = {};
            const options = {
                limit: Number(reqOptions.limit) || 10,
                page: Number(reqOptions.page) || 1,
            };

            if (reqQuery.category) {
                const categories = await this.getCategorys();
                if (categories.includes(reqQuery.category)) {
                    query.category = reqQuery.category;
                }
            }
            if (reqQuery.availability) {
                query.stock = { $gt: 0 };
            }

            const sortOptions = {
                "1": 1,
                "-1": -1,
                asc: "asc",
                desc: "desc",
            };
            const sortValue = sortOptions[reqOptions.sort];
            if (sortValue) options.sort = { price: sortValue };

            return await this.model.paginate(query, options);
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError("Unidentified error", 500, "getProducts");
            }
        }
    };

    getProductsById = async (pid) => {
        try {
            return await this.model.findById({ _id: pid }).lean();
        } catch (error) {
            console.error(error);
            throw new CustomError("Unidentified error", 500, "getProductsById");
        }
    };

    addProduct = async (fields) => {
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
            const validatedFields = validateFields(fields, requiredFields);
            if (typeof validatedFields === "string") {
                return validatedFields;
            }

            const newProduct = await this.model.create(validatedFields);
            return newProduct;
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                throw error;
            } else if (error.code === 11000) {
                throw new CustomError(`ERROR: Código repetido`, 400, "addProduct");
            } else {
                throw new CustomError(
                    `Verificar ERROR de mongoose código: ${error.code}`,
                    400,
                    "addProduct",
                );
            }
        }
    };

    updateProduct = async (pid, changedProduct) => {
        try {
            return await this.model.findByIdAndUpdate(pid, changedProduct, {
                new: true,
            });
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(`Unidentified error`, 400, "updateProduct");
            }
        }
    };

    deleteProductById = async (pid) => {
        try {
            return await this.model.findByIdAndDelete(pid)
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(`Unidentified error`, 500, "updateProduct");
            }
        }
    };

    deleteProductByCode = async (pcode) => {
        try {
            return await this.model.findOneAndDelete({ code: pcode })
        } catch (error) {
            console.error(error);
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(`Unidentified error`, 500, "updateProduct");
            }
        }
    };

    getCategorys = async () => {
        try {
            const categories = await this.model.aggregate([
                { $group: { _id: "$category" } },
                { $sort: { _id: 1 } },
            ]);
            return categories.map((cat) => {
                return cat._id;
            });
        } catch (error) {
            console.error(error);
            throw new CustomError("Unidentified error", 500, "getProducts");
        }
    };
}

module.exports = productDaoMongo;
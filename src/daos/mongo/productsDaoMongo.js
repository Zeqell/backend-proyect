const { productModel } = require('./models/products.model.js');

class ProductDaoMongo {
    constructor() {
        this.model = productModel;
    }

    getProducts = async (filters) => {
        const query = filters.query;
        const options = {
            limit: filters.limit * 1,
            page: filters.page * 1,
        };

        if (filters.category) {
            const categories = await this.getCategorys()
            //const categories = ['ruta', 'mtb'];
            if (typeof categories === 'string') {
                return 'Hubo un error en la petición';
            }
            if (categories.includes(filters.category)) {
                query['category'] = filters.category;
            }
        }

        if (filters.availability) {
            query['stock'] = { $gt: 0 };
        }

        if (filters.sort * 1 === 1 || filters.sort * 1 === -1) {
            options['sort'] = { price: filters.sort * 1 };
        }
        if (filters.sort === 'asc' || filters.sort === 'desc') {
            options['sort'] = { price: filters.sort };
        }

        const filter = { limit: filters.limit * 1, page: filters.page };
        if (filters.sort) {
            filter['sort'] = filters.sort;
        }

        try {
            const result = await this.model.paginate(query, options);
            //console.log(query, options);
            return result
        } catch (error) {
            return 'Hubo un error en la petición';
        }
    };

    getProductsById = async (pid) => {
        try {
            const result = await this.model.find({ _id: pid }).lean();

            if (result.length === 0) {
                return 'Producto no encontrado';
            }
            return result[0];
        } catch (error) {
            return 'Ha ocurrido un error al buscar el producto';
        }
    };

    addProduct = async ({
        title,
        description,
        code,
        price,
        stock,
        status = true,
        category,
        thumbnail,
    }) => {
        try {
            if (
                !title ||
                !description ||
                !code ||
                !price ||
                !stock ||
                !status ||
                !category ||
                !thumbnail
            ) {
                if (!title) return 'ERROR: debe completar el titulo';
                if (!description) return 'ERROR: debe completar la descripción';
                if (!code) return 'ERROR: debe completar el Código';
                if (!price) return 'ERROR: debe completar el Precio';
                if (!stock) return 'ERROR: debe completar el Stock';
                if (!status) return 'ERROR: debe completar el Estado';
                if (!category) return 'ERROR: debe completar la Categoria';
                if (!thumbnail) return 'ERROR: debe completar la Imagen';
                return 'ERROR: debe completar todos los campos';
            }

            const newProduct = {
                title: title,
                description: description,
                code: code,
                price: price,
                status: status,
                stock: stock,
                category: category,
                thumbnail: thumbnail,
            };

            return await this.model.create(newProduct);
        } catch (error) {
            if (error.code === 11000) {
                return 'ERROR: codigo repetido';
            }
            return 'Verificar ERROR de mongoose codigo: ' + error.code;
        }
    };

    updateProduct = async (pid, changedProduct) => {
        const updateProd = await this.getProductsById(pid);

        if (updateProd.length === 0) {
            return 'Producto no encontrado';
        }

        try {
            await this.model.updateOne({ _id: pid }, changedProduct);
            return await this.getProductsById(pid);
        } catch (error) {
            if (error.code === 11000) {
                return 'ERROR: esta queriendo ingresar un codigo repetido';
            }
            return 'ERROR: se ha producido une error al modificar el producto';
        }
    };

    deleteProductById = async (pid) => {
        const deleteProd = await this.getProductsById(pid);

        if (deleteProd.length === 0) {
            return 'Producto no encontrado';
        }
        try {
            await this.model.deleteOne({ _id: pid });
            return deleteProd;
        } catch (error) {
            return 'Hubo un error en la peticion';
        }
    };

    deleteProductByCode = async (pcode) => {
        const productoEliminado = await this.model.find({ code: pcode });

        if (productoEliminado.length === 0) {
            return 'Producto no encontrado';
        }
        try {
            await this.model.deleteOne({ code: pcode });
            return productoEliminado;
        } catch (error) {
            return 'Hubo un error en el la peticion';
        }
    };

    getCategorys = async () => {
        try {
            const list = await this.model.aggregate([
                { $group: { _id: '$category' } },
            ]);
            const arrayCategory = list.map((x) => {
                return x._id;
            });
            return arrayCategory;
        } catch (error) {
            return 'Ocurrio un Error';
        }
    };
}

exports.ProductMongo = ProductDaoMongo;
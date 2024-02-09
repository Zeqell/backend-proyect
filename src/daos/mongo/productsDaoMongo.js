const productModel = require('./models/products.model.js') 
class ProductDaoMongo {
    constructor() {
        this.model = productModel;
    }

    getProducts = async (query, options) => await this.model.paginate(query, options);

    getProductsById = async (pid) => await this.model.findById({ _id: pid }).lean();


    addProduct = async (fields) => await this.model.create(fields);

    updateProduct = async (pid, changedProduct) => await this.model.findByIdAndUpdate(pid, changedProduct, { new: true });

    deleteProductById = async (pid) => await this.model.findByIdAndDelete(pid);

    deleteProductByCode = async (pcode) => await this.model.findOneAndDelete({ code: pcode });

    getCategorys = async () => await this.model.distinct('category').sort();

    // getCategorys = async () => {
    // const categories = await this.model.aggregate([
    //   { $group: { _id: "$category" } },
    //   { $sort: { _id: 1 } },
    // ]);
    // return categories.map((cat) => {
    //   return cat._id;
    // });
    // };
}

module.exports = ProductDaoMongo;
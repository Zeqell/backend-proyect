const { ProductClass } = require('../daos/index.js')

const productService = new ProductClass();

const convertSort = (option, element) => {
    const sortOptions = {
        "1": 1,
        "-1": -1,
        asc: "asc",
        desc: "desc",
    };
    if (!option) return {}
    const objectReturn = {}
    objectReturn[element] = sortOptions[option];
    return objectReturn;
} // return object

const convertAvailability = (availability) => {
    if (availability == "true") return { stock: { $gt: 0 } }
} // return object

const checkCategory = async (category) => {
    const categories = await productService.getCategorys();
    return categories.includes(category);
} // return boolean

module.exports = {
    convertSort,
    convertAvailability,
    checkCategory
}
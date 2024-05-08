const generateProductErrorInfo = (product) => {
    return `Una o más propiedades estaban incompletas o no eran válidas.
        list of requires properties
        - Product: producto no encontrado, recibido ${product}
        - Product not added: no se puede agregar un nuevo producto a la base de datos
        - Product no deleted: no se encontró un producto para eliminar
    `
}

const generateCartErrorInfo = (user, cartId) => {
    return `Una o más propiedades estaban incompletas o no eran válidas.
        list of requires properties
        - Product not added to cart: no se puede agregar el producto al carrito, recibí ${user} y ${cartId}
    `
}

const generateCartRemoveErrorInfo = (cid, pid) => {
    return `Una o más propiedades estaban incompletas o no eran válidas.
        list of requires properties
        - Product not removed to cart: No puedo eliminar el producto al carrito, recibido ${cid} y ${pid}
    `
}

module.exports = {
    generateProductErrorInfo,
    generateCartErrorInfo,
    generateCartRemoveErrorInfo
}
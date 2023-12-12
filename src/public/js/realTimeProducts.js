const socket = io()
socket.on('connect', () => {
    console.log('Conexión establecida con el servidor de Socket.io')
})

// Actualización del listado de productos.
socket.on('updateProducts', (products) => {
    try {
        const productTableBody = document.getElementById('productTableBody')
        console.log(products)
        productTableBody.innerHTML = '' // Limpiamos la tabla antes de actualizar.

        products.forEach((product) => {
            const row = document.createElement('tr')
            row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>
                <button class="uk-icon-button" uk-icon="trash" onclick="deleteProduct(${product.id})"></button>
            </td>
            `
            productTableBody.appendChild(row)
        })
    } catch (error) {
        console.error('Error al procesar productos:', error)
    }
})

// Función para agregar un nuevo producto.
function addProduct() {
    const form = document.getElementById('addProductForm')
    const code = form.elements.code.value
    const title = form.elements.title.value
    const description = form.elements.description.value
    const price = form.elements.price.value
    const stock = form.elements.stock.value
    const thumbnail = 'https://hligco.com/wp-content/plugins/builder-mosaic/assets/images/image-placeholder.jpg'

    // Enviamos el evento al servidor.
    socket.emit('addProduct', { code, title, description, price, stock, thumbnail })

    form.reset() // Limpiamos el formulario después de enviar el nuevo producto.
}

// Eliminación de producto.
function deleteProduct(productId) {
    // Enviamos el evento al servidor.
    socket.emit('deleteProduct', productId)
}

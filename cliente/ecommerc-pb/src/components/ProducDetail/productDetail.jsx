
function ProductDetail({product}) {
  return (
    <div>
        <h1>{product.title}</h1>
        <h2>{product.description} </h2>
        <h3>Precio:{product.stock} </h3>
        <h3>Stock:{product.price} </h3>
    </div>
  )
}

export default ProductDetail
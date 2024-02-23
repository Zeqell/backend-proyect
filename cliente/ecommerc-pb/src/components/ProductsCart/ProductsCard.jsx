import { Link } from "react-router-dom"

const ProductsCard = ({product}) => {
    return (
        <div className="card w-25 m-3">
            <div className="card-body">
                <img src={product.thumbnail} className="card-img-top" alt = "img"/>
                <h3> {product.title} </h3>
                <h3> Stock: {product.stock} </h3>
                <h3> Price: {product.price} </h3>

            </div>
            <div className="card-footer">
                <Link to={`/detalle/${product._id}`} className="btn btn-outline-dark w-100">Detalle/</Link>
            </div>
    </div>
    )
}

export default ProductsCard
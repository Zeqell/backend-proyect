import { useEffect, useState } from 'react'
import ProductsList from '../components/ProductsList/ProductsList'

export const ProductsPage = () => {
    const [products, setProducts] = useState([])
    
    useEffect(()=>{
        const getProducts = async () =>{
            const dataJson = await fetch('http://localhost:4000/api/products')
            const data = await dataJson.json()
            setProducts(data.payload)
        }
        getProducts()

    },[])

    return (
    <div>
        <ProductsList products={products}/>
    </div>
    )
}

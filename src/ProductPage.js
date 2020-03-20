import React from 'react'

const ProductPage = ({product, addToCart}) => {
  return(
    <div>
      <h1>
        {product.name}
      </h1>
      <p>Price: ${Number(product.price).toFixed(2)}</p>
      <button onClick={ ()=> addToCart(product.id)}>Add to Cart</button>
    </div>
  )
}

export default ProductPage
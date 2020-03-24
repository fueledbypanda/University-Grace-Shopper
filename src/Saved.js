import React from 'react'
import { Link } from 'react-router-dom';

const Saved = ({addToCart, saved, products, userId, unsave}) => {
  return(
    <div id="products">
      <h1>Saved</h1>
      <ul id="productsList">
        {
          saved.map(item => {
            const found = products.find(product => {
              return product.id === item.productId && userId === item.userId
            })
            if(typeof found !== 'undefined') {
              return(
                <li>
                  <Link
                    to={`/products/${item.id}`}
                    onClick={el => setProductView(product)}
                  >
                    <div>{found.name}</div>
                      <img src={found.image} />
                    <div>${Number(found.price).toFixed(2)}</div>
                  </Link>
                  <button onClick={() => addToCart(found.id)}>Add to Cart</button>
                  <button onClick={() => unsave(item.id)}>Unsave</button>
                </li>
              )
            }
          })
        }
      </ul>
    </div>
  )
}

export default Saved
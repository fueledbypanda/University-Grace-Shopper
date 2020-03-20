import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

const Products = ({ products, addToCart })=> {
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {
          products.map( product => {
            return (
              <li key={ product.id }>
                  <Link to={`/product/${product.id}`}>
                    <span>
                    { product.name }
                    </span>
                    <span>
                    ${
                      Number(product.price).toFixed(2)
                    }
                    </span>
                  </Link>
                <button onClick={ ()=> addToCart(product.id)}>Add to Cart</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Products;

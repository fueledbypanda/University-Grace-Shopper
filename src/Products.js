import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import ProductPage from './ProductPage';


const Products = ({ products, addToCart, setProductView })=> {

  return (
    <div>
        <h2>Products</h2>
        <ul>
          {
            products.map( product => {
              return (
                <li key={ product.id }>
                    <Link to={`/product/${product.id}`} onClick={(el) => setProductView(product)}>
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

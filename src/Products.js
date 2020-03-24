import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import ProductPage from './ProductPage';

const Products = ({ products, addToCart, setProductView }) => {
  return (
    <div id="products">
      <h1>Products</h1>
      <ul id="productsList">
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                onClick={el => setProductView(product)}
              >
                <div>{product.name}</div>
                <img src={product.image} />
                <div>${Number(product.price).toFixed(2)}</div>
              </Link>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Products;

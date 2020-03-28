import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({
  products,
  addToCart,
  setProductView,
  save,
  lowerInventory,
}) => {
  return (
    <div id="products">
      <h1>Products</h1>
      <ul id="productsList">
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                onClick={el => setProductView(product)}
              >
                <div>{product.name}</div>
                <img src={product.image} />
                <div>${Number(product.price).toFixed(2)}</div>
                <div>
                  {product.inventory <= 0 ? (
                    <p>Out Of Stock</p>
                  ) : product.inventory > 0 && product.inventory < 15 ? (
                    <p>Limited Stock</p>
                  ) : (
                    <p>In Stock</p>
                  )}
                </div>
              </Link>
              <button
                onClick={() => {
                  addToCart(product.id);
                  lowerInventory(product.id);
                }}
              >
                Add to Cart
              </button>
              <button onClick={() => save(product.id)}>Save For Later</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Products;

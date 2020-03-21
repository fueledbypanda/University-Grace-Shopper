import React from "react";

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <div>{product.name}</div>
              <div>
                <img src={product.image} />
              </div>
              <div>${Number(product.price).toFixed(2)}</div>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Products;

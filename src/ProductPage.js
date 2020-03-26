import React from "react";

const ProductPage = ({ product, addToCart }) => {
  return (
    <div id="productPage">
      <img src={product.image} />
      <h1>{product.name}</h1>
      <p>Price: ${Number(product.price).toFixed(2)}</p>
      <p>{product.department}</p>
      <p>{product.material}</p>
      <p>{product.adjective}</p>
      <button onClick={() => addToCart(product.id)}>Add to Cart</button>
    </div>
  );
};

export default ProductPage;

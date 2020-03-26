import React from "react";

const ProductPage = ({ product, addToCart }) => {
  return (
    <div id="productPage" className="card">
      <img src={product.image} />
      <h1>{product.name}</h1>
      <p className="price">Price: ${Number(product.price).toFixed(2)}</p>
      <p>{product.department}</p>
      <p>{product.adjective}</p>
      <p>{product.material}</p>
      <button onClick={() => addToCart(product.id)}>Add to Cart</button>
    </div>
  );
};

export default ProductPage;

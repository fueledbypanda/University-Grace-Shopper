import React, { useState } from 'react';

const ProductPage = ({ product, addToCart, userProducts }) => {
  const [rating, setRating] = useState(product.rating);
  const handleRating = e => {
    setRating(e.target.value);
  };
  let isPurchased = false;
  const purchasedProduct = userProducts.find(
    userProduct => userProduct.productId === product.id
  );
  if (purchasedProduct) {
    isPurchased = true;
  }

  return (
    <div id="productPage" className="card">
      <img src={product.image} />
      <h1>{product.name}</h1>
      <p className="price">Price: ${Number(product.price).toFixed(2)}</p>
      <h4>{product.department}</h4>
      <div>
        Rating:
        <input
          id="slider"
          type="range"
          min="0"
          max="5"
          onChange={handleRating}
          disabled={!isPurchased}
        ></input>
        {rating}
      </div>
      <h4>Description</h4>
      <p>This awesome {product.adjective} product!</p>
      <p>
        Made from {product.material} Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.
      </p>
      <button onClick={() => addToCart(product.id)}>Add to Cart</button>
    </div>
  );
};

export default ProductPage;

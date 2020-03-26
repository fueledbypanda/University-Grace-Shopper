import React from "react";
import { Link } from "react-router-dom";
import SingleProductPage from "./SingleProductPage";

const Products = ({ products, addToCart, setProductView, save }) => {
  return (
    <div id="products">
      <h2>Products</h2>
      <ul id="productsList">
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                onClick={el => setProductView(product)}
              >
                {/* <SingleProductPage
                  addToCart={addToCart}
                  products={products}
                  setProductView={setProductView}
                  save={save}
                /> */}
                <div>{product.name}</div>
                <img src={product.image} />
                <div>${Number(product.price).toFixed(2)}</div>
              </Link>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
              <button onClick={() => save(product.id)}>Save For Later</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Products;

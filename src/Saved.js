import React from 'react';
import { Link } from 'react-router-dom';

const Saved = ({ addToCart, saved, products, userId, unsave }) => {
  return (
    <div id="savedProducts">
      <h1>Saved</h1>
      <ul id="savedProductsList">
        {saved.map((item, i) => {
          const found = products.find(product => {
            return product.id === item.productId && userId === item.userId;
          });
          if (typeof found !== 'undefined') {
            return (
              <li key={i}>
                <Link
                  to={`/products/${item.id}`}
                  onClick={el => setProductView(product)}
                >
                  <div>{found.name}</div>
                  <img src={found.image} />
                  <div>${Number(found.price).toFixed(2)}</div>
                </Link>
                <div>
                  {found.inventory <= 0 ? (
                    <p>Out Of Stock</p>
                  ) : found.inventory > 0 && found.inventory < 15 ? (
                    <p>Limited Stock ({found.inventory})</p>
                  ) : (
                    <p>In Stock</p>
                  )}
                </div>
                <button onClick={() => addToCart(found.id)}>Add to Cart</button>
                <button onClick={() => unsave(item.id)}>Unsave</button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Saved;

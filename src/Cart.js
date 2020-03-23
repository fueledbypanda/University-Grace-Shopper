import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  setProductView,
  subtractFromCart,
  addToCart,
}) => {
  return (
    <div id="cart">
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={createOrder}
      >
        Create Order
      </button>
      <ul>
        {lineItems
          .filter(lineItem => lineItem.orderId === cart.id)
          .map(lineItem => {
            const product = products.find(
              product => product.id === lineItem.productId
            );
            return (
              <li key={lineItem.id}>
                <img src={product.image} />
                <Link
                  to={`/products/${product.id}`}
                  onClick={el => setProductView(product)}
                >
                  {product && product.name}{' '}
                </Link>
                <span>
                  <button
                    onClick={el => subtractFromCart(product.id, lineItem)}
                  >
                    -
                  </button>
                  <span className="quantity">
                    Quantity: {lineItem.quantity}
                  </span>
                  <button onClick={el => addToCart(product.id)}>+</button>
                </span>
                <button onClick={() => removeFromCart(lineItem.id)}>
                  Remove From Cart
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Cart;

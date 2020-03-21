import React from 'react';
import {Link} from 'react-router-dom'

const Orders = ({ lineItems, orders, products, setProductView }) => {
  let totalPrice = 0;
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          totalPrice = 0;
          const _lineItems = lineItems.filter(
            lineItem => lineItem.orderId === order.id
          );
          return (
            <li key={order.id}>
              <div>OrderID: {order.id.slice(0, 4)}</div>
              <span className="orderDate">Order Date: {order.createdAt}</span>
              <form className="addressForm">
                <input
                  className="addressInput"
                  type="text"
                  placeholder="Add a new address"
                />
                <input className="submitAddress" type="submit" value="Submit" />
                <select
                  className="addressSelect"
                  value="Select an address"
                  onChange={() => {}}
                >
                  <option defaultValue disabled>
                    Select an address
                  </option>
                </select>
              </form>
              <span className="address">Shipping Address:</span>
              <ul>
                {_lineItems.map(lineItem => {
                  const product = products.find(
                    product => product.id === lineItem.productId
                  );
                  totalPrice += parseFloat(product.price, 10);
                  return (
                    <li key={lineItem.id}>
                      <Link to={`/product/${product.id}`} onClick={(el) => setProductView(product)}>>
                        {product && product.name}
                        <span className="price">
                          Price: ${parseFloat(product.price, 10)}
                        </span>
                      </Link>
                      <span className="quantity">
                        Quantity: {lineItem.quantity} ($
                        {parseFloat(product.price, 10) * lineItem.quantity})
                      </span>
                      <span className="subTotal">Subtotal: ${totalPrice}</span>
                    </li>
                  );
                })}
              </ul>
              Total: ${totalPrice}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;

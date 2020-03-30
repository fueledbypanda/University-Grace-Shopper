import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment';

const Orders = ({
  lineItems,
  orders,
  products,
  setProductView,
  user,
  setUser,
  users,
  setUsers,
}) => {
  let totalPrice = 0;
  const userCopy = { ...user };
  if (user.addresses === null) {
    userCopy.addresses = [];
  }
  const usersCopy = [...users];
  const userIndex = users.indexOf(user);
  let [addresses, setAddresses] = useState([...userCopy.addresses]);
  return (
    <div id="orders">
      <h1>Orders</h1>
      <ul>
        {orders.map(order => {
          totalPrice = 0;
          const _lineItems = lineItems.filter(
            lineItem => lineItem.orderId === order.id
          );

          return (
            <li key={order.id}>
              <div>
                <h3>OrderID: {order.id.slice(0, 4)}</h3>
              </div>
              <span className="orderDate">
                <h3>
                  Order Date: {moment(order.createdAt).format('MM/DD/YYYY')}
                </h3>
              </span>

              <span className="address">
                <h3>Shipping Address: {order.address}</h3>
              </span>
              <ul>
                {_lineItems.map(lineItem => {
                  const product = products.find(
                    product => product.id === lineItem.productId
                  );
                  totalPrice = totalPrice + product.price * lineItem.quantity;

                  return (
                    <li key={lineItem.id}>
                      <Link
                        to={`/products/${product.id}`}
                        onClick={el => setProductView(product)}
                      >
                        {' '}
                        <img src={product.image} />
                        {product && product.name}
                      </Link>
                      <div className="orderInfo">
                        <span className="price">
                          Price: ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="quantity">
                          Quantity: {lineItem.quantity} ($
                          {Number(product.price * lineItem.quantity).toFixed(2)}
                          )
                        </span>
                        <span className="subTotal">
                          Subtotal: ${Number(totalPrice).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <h2>Total: ${Number(totalPrice).toFixed(2)}</h2>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;

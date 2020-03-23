import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const Orders = ({
  lineItems,
  orders,
  products,
  setProductView,
  addAddress,
  user,
  users,
  setUsers,
  userAddresses,
  setUserAddresses,
}) => {
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
          console.log(user);
          const [selectedAddress, setSelectedAddress] = useState(
            user.addresses[0]
          );
          const userAddressOptions = user.addresses.map((address, i) => (
            <option key={i}>{address}</option>
          ));
          const [newAddress, setNewAddress] = useState('');

          const handleSubmit = async e => {
            e.preventDefault();

            const userCopy = { ...user };
            userCopy.addresses.unshift(newAddress);

            const usersCopy = [...users];
            const userIndex = users.indexOf(user);

            const updated = (
              await Axios.put(`/api/users/${userCopy.id}`, userCopy)
            ).data;
            usersCopy.splice(userIndex, 1, updated);
            setUsers(usersCopy);
            setSelectedAddress(newAddress);
          };

          return (
            <li key={order.id}>
              <div>OrderID: {order.id.slice(0, 4)}</div>
              <span className="orderDate">Order Date: {order.createdAt}</span>
              <form className="addressForm" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Add New Address"
                  onChange={e => setNewAddress(e.target.value)}
                />

                <input className="submitAddress" type="submit" value="Submit" />
                <select
                  className="addressSelect"
                  value="Select an address"
                  onChange={e => {
                    setSelectedAddress(e.target.value);
                  }}
                >
                  <option defaultValue disabled>
                    Select an address
                  </option>
                  {userAddressOptions}
                </select>
              </form>
              <span className="address">
                Shipping Address: {selectedAddress}
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
                        {product && product.name}
                      </Link>
                      <span className="price">
                        Price: ${Number(product.price).toFixed(2)}
                      </span>
                      <span className="quantity">
                        Quantity: {lineItem.quantity} ($
                        {Number(product.price * lineItem.quantity).toFixed(2)})
                      </span>
                      <span className="subTotal">
                        Subtotal: ${Number(totalPrice).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              Total: ${Number(totalPrice).toFixed(2)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;

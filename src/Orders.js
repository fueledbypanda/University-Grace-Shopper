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
  let [addresses, setAddresses] = useState(userCopy.addresses);
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          totalPrice = 0;
          const _lineItems = lineItems.filter(
            lineItem => lineItem.orderId === order.id
          );
          const [newAddress, setNewAddress] = useState('');
          const [selectedAddress, setSelectedAddress] = useState(addresses[0]);

          const handleSubmit = async e => {
            e.preventDefault();
            userCopy.addresses.unshift(newAddress);
            Axios.put(`/api/users/${user.id}`, userCopy);
            usersCopy.slice(userIndex, 1, userCopy);

            setAddresses([newAddress, ...addresses]);
            setNewAddress('');
            setUser(userCopy);
            setSelectedAddress(newAddress);
          };
          console.log(addresses);
          const userAddressOptions = addresses.map((address, i) => (
            <option key={i} value={address}>
              {address}
            </option>
          ));

          return (
            <li key={order.id}>
              <div>OrderID: {order.id.slice(0, 4)}</div>
              <span className="orderDate">
                Order Date: {moment(order.createdAt).format('MM/DD/YYYY')}
              </span>
              <form className="addressForm" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Add New Address"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                />

                <input className="submitAddress" type="submit" value="Submit" />
                <select
                  className="addressSelect"
                  value={selectedAddress}
                  onChange={e => {
                    setSelectedAddress(e.target.value);
                  }}
                >
                  <option defaultValue value={selectedAddress} disabled>
                    Select an Existing Address
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

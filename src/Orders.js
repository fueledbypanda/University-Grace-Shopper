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
          const [newAddress, setNewAddress] = useState('');
          const [selectedAddress, setSelectedAddress] = useState(addresses[0]);

          const handleSubmit = async e => {
            e.preventDefault();
            userCopy.addresses.unshift(newAddress);
            Axios.put(`/api/users/${user.id}`, userCopy);
            usersCopy.slice(userIndex, 1, userCopy);
            setUsers([...usersCopy]);

            setAddresses([newAddress, ...addresses]);
            setNewAddress('');
            setUser(userCopy);
            setSelectedAddress(newAddress);
          };
          const userAddressOptions = addresses.map((address, i) => (
            <option key={i} value={address}>
              {address}
            </option>
          ));

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
                <h3>Shipping Address: {selectedAddress}</h3>
              </span>
              <ul>
                {_lineItems.map(lineItem => {
                  const product = products.find(
                    product => product.id === lineItem.productId
                  );
                  totalPrice = totalPrice + product.price * lineItem.quantity;
                  const [rating, setRating] = useState(undefined);
                  const handleRating = e => {
                    setRating(e.target.value);
                    const lineItemCopy = { ...lineItem };
                    lineItemCopy.rating = rating;

                    Axios.put(`/api/lineItems/${lineItem.id}`, lineItemCopy);
                  };
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
                      <div>
                        Rating:
                        <input
                          type="range"
                          min="0"
                          max="5"
                          onChange={handleRating}
                        ></input>
                        {rating}
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

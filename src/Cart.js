import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const Cart = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  setProductView,
  subtractFromCart,
  addToCart,
  save,
  addInventory,
  lowerInventory,
  user,
  users,
  setUser,
  setUsers,
  orders,
  setOrders,
  userProducts,
  setUserProducts,
}) => {
  const userCopy = { ...user };
  const usersCopy = [...users];
  if (user.addresses === null) {
    userCopy.addresses = [];
  }

  const userIndex = users.indexOf(user);
  const [addresses, setAddresses] = useState([...userCopy.addresses]);
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

  const setAddress = async () => {
    const orderCopy = { ...cart };
    const ordersCopy = [...orders];
    orderCopy.address = selectedAddress;
    const updated = (await Axios.put(`api/orders/${orderCopy.id}`, orderCopy))
      .data;
    ordersCopy.slice[(0, 1, updated)];
    setOrders([...ordersCopy]);
  };
  const createUserProduct = async () => {
    lineItems.map(async lineItem => {
      const prod = { userId: user.id, productId: lineItem.productId };
      const userProduct = (await Axios.post('/api/user_products', prod)).data;
      const userProductsCopy = [...userProducts, userProduct];
      setUserProducts([...userProductsCopy]);
    });
  };

  return (
    <div id="cart">
      <h1>Cart</h1>
      ID: {cart.id && cart.id.slice(0, 4)}
      <span className="address">
        <h3>Shipping Address: {selectedAddress}</h3>
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
      <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={() => {
          createUserProduct();
          createOrder();
          setAddress();
        }}
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
                    onClick={el => {
                      subtractFromCart(product.id, lineItem);
                      addInventory(product.id);
                    }}
                  >
                    -
                  </button>
                  <span className="quantity">
                    Quantity: {lineItem.quantity}
                  </span>
                  <button
                    onClick={el => {
                      addToCart(product.id);
                      lowerInventory(product.id);
                    }}
                  >
                    +
                  </button>
                </span>
                <button
                  onClick={() => {
                    removeFromCart(lineItem.id);
                    addInventory(product.id, lineItem.quantity);
                  }}
                >
                  Remove From Cart
                </button>
                <button
                  onClick={() => {
                    removeFromCart(lineItem.id);
                    save(product.id);
                    addInventory(product.id);
                  }}
                >
                  Save for Later
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Cart;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const Orders = ({
  lineItems,
  orders,
  products,
  setProductView,
  addresses,
  setAddresses,
  userAddresses,
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
          const [streetAddress, setStreetAddress] = useState('');
          const [state, setState] = useState('');
          const [zipcode, setZipcode] = useState('');
          const handleSubmit = async e => {
            e.preventDefault();
            const created = (
              await Axios.post('/api/addresses/', {
                streetAddress,
                state,
                zipcode,
              })
            ).data;
            setAddresses([...addresses, created]);
          };

          return (
            <li key={order.id}>
              <div>OrderID: {order.id.slice(0, 4)}</div>
              <span className="orderDate">Order Date: {order.createdAt}</span>
              <form className="addressForm" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Street Address"
                  onChange={e => setStreetAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  onChange={e => setState(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  onChange={e => setZipcode(e.target.value)}
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
<<<<<<< HEAD
                      <Link
                        to={`/product/${product.id}`}
                        onClick={el => setProductView(product)}
                      >
=======
                      <Link to={`/products/${product.id}`} onClick={(el) => setProductView(product)}>>
>>>>>>> 75ace074d5121f606f6b55b292cf5957a7f41c59
                        {product && product.name}
                      </Link>
                      <span className="price">
                        Price: ${parseFloat(product.price, 10)}
                      </span>
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

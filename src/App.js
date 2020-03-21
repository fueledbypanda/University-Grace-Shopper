import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Login from './Login';
import Orders from './Orders';
import Cart from './Cart';
import Products from './Products';
import Home from './Home';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      authorization: token,
    },
  };
};

const App = () => {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [auth, setAuth] = useState({});
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(response => setProducts(response.data));
  }, []);

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem('token');
      axios.get('/api/getLineItems', headers()).then(response => {
        setLineItems(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getCart', headers()).then(response => {
        setCart(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getOrders', headers()).then(response => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  const login = async credentials => {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get('/api/auth', headers());
    setAuth(response.data);
  };

  const logout = () => {
    window.location.hash = '#';
    setAuth({});
  };

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const createOrder = () => {
    const token = window.localStorage.getItem('token');
    axios
      .post('/api/createOrder', null, headers())
      .then(response => {
        setOrders([response.data, ...orders]);
        const token = window.localStorage.getItem('token');
        return axios.get('/api/getCart', headers());
      })
      .then(response => {
        setCart(response.data);
      });
  };

  const addToCart = productId => {
    axios.post('/api/addToCart', { productId }, headers()).then(response => {
      const lineItem = response.data;
      const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id);
      if (!found) {
        setLineItems([...lineItems, lineItem]);
      } else {
        const updated = lineItems.map(_lineItem =>
          _lineItem.id === lineItem.id ? lineItem : _lineItem
        );
        setLineItems(updated);
      }
    });
  };

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId));
    });
  };

  const { view } = params;

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
          </ul>
        </nav>

        <Switch>
<<<<<<< HEAD
          <Route path="/home">
=======
          <Route exact path="/">
>>>>>>> 2aabf92a0e6624f168fc96ce52f5ced97e09ff47
            <Home
              auth={auth}
              login={login}
              logout={logout}
              addToCart={addToCart}
              products={products}
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              orders={orders}
            />
          </Route>
<<<<<<< HEAD
          <Route path="/cart">
=======
          <Route exact path="/cart">
>>>>>>> 2aabf92a0e6624f168fc96ce52f5ced97e09ff47
            <Cart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
            />
          </Route>
<<<<<<< HEAD
          <Route path="/orders">
=======
          <Route exact path="/orders">
>>>>>>> 2aabf92a0e6624f168fc96ce52f5ced97e09ff47
            <Orders
              lineItems={lineItems}
              orders={orders}
              cart={cart}
              products={products}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;

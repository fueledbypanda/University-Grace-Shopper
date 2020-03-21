import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Orders from './Orders';
import Cart from './Cart';
import Home from './Home';
import Products from './Products';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import ProductPage from './ProductPage';

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
  const [productView, setProductView] = useState([])

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


  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/products">Show All</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
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
              productView={productView}
              setProductView={setProductView}
            />
          </Route>
          <Route exact path="/cart">
            <Cart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
              setProductView={setProductView}
            />
          </Route>
          <Route exact path="/orders">
            <Orders
              lineItems={lineItems}
              orders={orders}
              cart={cart}
              products={products}
              setProductView={setProductView}
            />
          </Route>
          <Route exact path="/products">
            <Products addToCart={ addToCart } products={ products } productView={productView} setProductView={setProductView}/>
          </Route>
          <Route exact path={`/products/${productView.id}`}>
            <ProductPage product={productView} addToCart={addToCart}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Orders from './Orders';
import Cart from './Cart';
import Home from './Home';
import Products from './Products';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ProductPage from './ProductPage';
import Saved from './Saved';
import Admin from './Admin';

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
  const [productView, setProductView] = useState([]);
  const [saved, setSaved] = useState([]);
  const [promos, setPromos] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get('/api/users').then(response => setUsers(response.data));
  }, []);

  useEffect(() => {
    if (auth.id) {
      const currentUser = users.find(user => user.id === auth.id);
      setUser(currentUser);
    }
  }, [auth]);

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

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/saves').then(response => setSaved(response.data));
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/promos').then(response => setPromos(response.data));
    }
  }, [auth]);

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

  const save = productId => {
    const found = saved.find(item => item.productId === productId);
    if (found === undefined) {
      axios.post('/api/saves', { productId }, headers()).then(response => {
        setSaved([...saved, response.data]);
      });
    }
  };

  const unsave = saveId => {
    axios.delete(`/api/saves/${saveId}`).then(() => {
      setSaved(saved.filter(_saved => _saved.id !== saveId));
    });
  };

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId));
    });
  };

  const createPromo = (code, discount) => {
    axios
      .post('/api/promos', { code: code, discount: discount })
      .then(response => {
        setPromos([...promos, response.data]);
      });
  };

  const deletePromo = id => {
    axios.delete(`/api/promos/${id}`).then(() => {
      setPromos(promos.filter(item => item.id !== id));
    });
  };

  return (
    <Router>

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
            <Link to="/products">View All Products</Link>
          </li>
          <li>
            <Link to="/saved">Saved</Link>
          </li>
          {auth.role === 'ADMIN' ? (

            <li>
              <Link to="/admin">Admin</Link>
            </li>
          ) : null}
        </ul>
      </nav>
      <div id="app">
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
              save={save}
            />
          </Route>
          <Route exact path="/orders">
            <Orders
              lineItems={lineItems}
              orders={orders}
              cart={cart}
              products={products}
              setProductView={setProductView}
              user={user}
              setUser={setUser}
              users={users}
              setUsers={setUsers}
            />
          </Route>
          <Route exact path="/products">
            <Products
              addToCart={addToCart}
              products={products}
              setProductView={setProductView}
              save={save}
            />
          </Route>
          <Route exact path={`/products/${productView.id}`}>
            <ProductPage product={productView} addToCart={addToCart} />
          </Route>
          <Route exact path="/saved">
            <Saved
              addToCart={addToCart}
              saved={saved}
              products={products}
              userId={auth.id}
              unsave={unsave}
            />
          </Route>
          {auth.role === 'ADMIN' ? (
            <Route exact path="/admin">
              <Admin
                user={auth}
                createPromo={createPromo}
                promos={promos}
                deletePromo={deletePromo}
              />
            </Route>
          ) : null}
        </Switch>
      </div>
    </Router>
  );
};

export default App;

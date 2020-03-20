import React from 'react'
import Login from './Login';
import Orders from './Orders';
import Cart from './Cart';
import Products from './Products';

const Home = ({
  auth,
  login,
  logout,
  addToCart,
  products,
  lineItems,
  removeFromCart,
  cart,
  createOrder,
  orders
}) => {

    if(!auth.id){
      return (
        <Login login={ login }/>
      );
    }
    else {
      return (
        <div>
          <h1>Foo, Bar, Bazz.. etc Store</h1>
          <button onClick={ logout }>Logout { auth.username } </button>
          <div className='horizontal'>
            <Products addToCart={ addToCart } products={ products } />
            {/* <Cart lineItems={ lineItems } removeFromCart={ removeFromCart } cart={ cart } createOrder={ createOrder } products={ products }/> */}
            <Orders lineItems={ lineItems } products={ products } orders={ orders }/>
          </div>
        </div>
      );
    }
}

export default Home
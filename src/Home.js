import React from 'react'
import Login from './Login';
import Products from './Products';

const Home = ({
  auth,
  login,
  logout,
  addToCart,
  products,
  productView,
  setProductView
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
            <h1>Landing Page</h1>
          </div>
        </div>
      );
    }
}

export default Home
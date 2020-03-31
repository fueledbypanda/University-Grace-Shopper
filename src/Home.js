import React from 'react';
import Login from './Login';
import { Link } from 'react-router-dom';

const Home = ({ auth, login, logout, lastViewed, products }) => {
  if (!auth.id) {
    return <Login login={login} />;
  } else {
    return (
      <div id="home">
        <h1>University Grace Shopper</h1>
        <button onClick={logout}>Logout {auth.username} </button>
        <div className="horizontal">
          <div>
            <img id="home-img" src="https://www.freedigitalphotos.net/images/img/homepage/339504.jpg" />
            <h1>Last Viewed</h1> 
            <ul id="lastViewed">
              {
                lastViewed.map(product => {
                  const item = products.find(prod => prod.id === product)
                  if(product !== "") {
                    return (
                      <li key={item.id}>
                        <Link
                          to={`/products/${item.id}`}
                          onClick={el => {
                            setProductView(item)
                            setViewed(item.id, auth.id)
                          }}
                        >
                          <div>{item.name}</div>
                          <img src={item.image} />
                          <div>${Number(item.price).toFixed(2)}</div>
                          <div>
                            {item.inventory <= 0 ? (
                              <p>Out Of Stock</p>
                            ) : item.inventory > 0 && item.inventory < 15 ? (
                              <p>Limited Stock ({item.inventory})</p>
                            ) : (
                              <p>In Stock</p>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            if (item.inventory !== 0) {
                              addToCart(item.id);
                              lowerInventory(item.id);
                            }
                          }}
                        >
                          Add to Cart
                        </button>
                        <button onClick={() => save(item.id)}>Save For Later</button>
                      </li>
                    )

                  }
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;

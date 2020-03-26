const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const models = db.models;
const morgan = require('morgan');

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

// var myLogger = function(req, res, next) {
//   console.log(req.body);
//   next();
// };
// app.use(myLogger);

// app.use(
//   morgan(':method :url :status :res[content-length] - :response-time ms')
// );

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = Error('not authorized');
    error.status = 401;
    return next(error);
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(Error('not authorized'));
  }
  next();
};

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  db.findUserFromToken(token)
    .then(auth => {
      req.user = auth;
      next();
    })
    .catch(ex => {
      const error = Error('not authorized');
      error.status = 401;
      next(error);
    });
});

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.post('/api/auth', (req, res, next) => {
  db.authenticate(req.body)
    .then(token => res.send({ token }))
    .catch(() => {
      const error = Error('not authorized');
      error.status = 401;
      next(error);
    });
});

app.get('/api/auth', isLoggedIn, (req, res, next) => {
  res.send(req.user);
});

app.get('/api/getCart', (req, res, next) => {
  db.getCart(req.user.id)
    .then(cart => res.send(cart))
    .catch(next);
});

app.get('/api/getOrders', (req, res, next) => {
  db.getOrders(req.user.id)
    .then(orders => res.send(orders))
    .catch(next);
});

app.post('/api/createOrder', (req, res, next) => {
  db.createOrder(req.user.id)
    .then(order => res.send(order))
    .catch(next);
});

app.get('/api/getLineItems', (req, res, next) => {
  db.getLineItems(req.user.id)
    .then(lineItems => res.send(lineItems))
    .catch(next);
});

app.post('/api/addToCart', (req, res, next) => {
  db.addToCart({ userId: req.user.id, productId: req.body.productId })
    .then(lineItem => res.send(lineItem))
    .catch(next);
});


app.post('/api/subtractItem', (req, res, next) => {
  db.subtractItem({ userId: req.user.id, productId: req.body.productId })
  .then(lineItem => res.send(lineItem))
  .catch(next);
});

app.delete('/api/removeFromCart/:id', (req, res, next) => {
  db.removeFromCart({ userId: req.user.id, lineItemId: req.params.id })
  .then(() => res.sendStatus(204))
  .catch(next);
});

app.get('/api/promos', (req, res, next) => {
  db.models.promos
  .read()
  .then(response => res.send(response))
  .catch(next)
})

app.post('/api/promos', (req, res, next) => {
  db.models.promos
  .create(req.body.code, req.body.discount)
  .then(response => res.send(response))
  .catch(next)
})

app.delete('/api/promos/:id', (req, res, next) => {
  console.log(req.params.id)
  db.models.promos
  .delete(req.params.id)
  .then(response => res.send(response))
  .catch(next)
})

app.post('/api/saves', (req, res, next) => {
  db.models.saved
  .create(req.user.id, req.body.productId)
  .then(response => res.send(response))
  .catch(next)
})

app.get('/api/saves', (req, res, next) => {
  db.models.saved
  .read()
  .then(saves => res.send(saves))
  .catch(next)
})

app.delete('/api/saves/:id', (req, res, next)  => {
  db.models.saved
  .delete(req.params.id)
  .then(saves => res.send(saves))
  .catch(next)
})

app.get('/api/products', (req, res, next) => {
  db.models.products
  .read()
  .then(products => res.send(products))
  .catch(next);
});

app.get('/api/users', (req, res, next) => {
  db.models.users
  .read()
  .then(users => res.send(users))
    .catch(next);
});

app.get('/api/users/:id', (req, res, next) => {
  const id = req.params.id;
  db.models.users
    .readOne(req.params.id)
    .then(user => res.send(user))
    .catch(next);
});

app.get('/api/lineItems/:id', (req, res, next) => {
  const id = req.params.id;
  db.models.lineItems
    .readOne(req.params.id)
    .then(lineItem => res.send(lineItem))
    .catch(next);
  });
  
app.put('/api/users/:id', (req, res, next) => {
  const id = req.params.id;
  db.models.users.update(req.body).then(response => res.send(response));
});

app.put('/api/lineItems/:id', (req, res, next) => {
  const id = req.params.id;
  db.models.lineItems.update(req.body).then(response => res.send(response));
});

Object.keys(models).forEach(key => {
  app.get(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .read({ user: req.user })
      .then(items => res.send(items))
      .catch(next);
  });
  app.post(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .create({ user: req.user })
      .then(items => res.send(items))
      .catch(next);
  });
});

app.use((req, res, next) => {
  const error = {
    message: `page not found ${req.url} for ${req.method}`,
    status: 404,
  };
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err.status);
  res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;

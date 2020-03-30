const client = require("./client");
const faker = require("faker");

const { authenticate, compare, findUserFromToken, hash } = require("./auth");

const models = ({
  products,
  users,
  orders,
  lineItems,
  userProducts
} = require("./models"));

const {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  subtractItem,
  getSaves,
  addToSave
} = require("./userMethods");

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS user_products;
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users cascade;
    DROP TABLE IF EXISTS products cascade;
    DROP TABLE IF EXISTS saves;
    DROP TABLE IF EXISTS promos;

    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      addresses text[],
      usedPromos text[],
      CHECK (char_length(username) > 0)
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      price DECIMAL NOT NULL,
      image VARCHAR(255) NOT NULL,
      inventory INT DEFAULT 100,
      department VARCHAR(255) NOT NULL,
      material VARCHAR(255) NOT NULL,
      adjective VARCHAR(255) NOT NULL,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE user_products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID NOT NULL,
      "productId" UUID NOT NULL,
      rating INTEGER DEFAULT NULL
    );
    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      address VARCHAR default '',
      status VARCHAR(10) DEFAULT 'CART',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );
    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1
    );
    CREATE TABLE saves(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL
    );
    CREATE TABLE promos(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR NOT NULL UNIQUE,
      discount INT NOT NULL
    );
  `;

  await client.query(SQL);

  const _users = {
    lucy: {
      username: "lucy",
      password: "LUCY",
      role: "ADMIN"
    },
    moe: {
      username: "moe",
      password: "MOE",
      role: null
    },
    curly: {
      username: "larry",
      password: "LARRY",
      role: null
    }
  };

  const _products = {};

  const makeProductWithFaker = () => {
    const mockProduct = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      image: faker.image.avatar(),
      department: faker.commerce.department(),
      material: faker.commerce.productMaterial(),
      adjective: faker.commerce.productAdjective()
    };
    return mockProduct;
  };

  const makeProductList = () => {
    for (let i = 0; i < 16; i++) {
      _products[i] = makeProductWithFaker();
    }
  };

  makeProductList();

  const [lucy, moe] = await Promise.all(
    Object.values(_users).map(user => users.create(user))
  );
  const [foo, bar, bazz, doo, dar, dazz] = await Promise.all(
    Object.values(_products).map(product => products.create(product))
  );

  const _orders = {
    moe: {
      userId: moe.id
    },
    lucy: {
      userId: lucy.id
    }
  };

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});
  const productMap = (await products.read()).reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {});
  return {
    users: userMap,
    products: productMap
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  subtractItem,
  getSaves,
  addToSave
};

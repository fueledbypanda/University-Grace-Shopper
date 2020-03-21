const client = require("../client");

const products = {
  read: async () => {
    return (await client.query("SELECT * from products")).rows;
  },
  create: async ({ name, price, image }) => {
    const SQL = `INSERT INTO products(name, price, image) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [name, price, image])).rows[0];
  }
};

module.exports = products;

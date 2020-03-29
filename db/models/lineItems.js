const client = require('../client');

const lineItems = {
  read: async () => {
    return (await client.query('SELECT * from "lineItems"')).rows;
  },
  create: async ({ orderId, productId, rating }) => {
    const SQL = `INSERT INTO "lineItems" ("orderId", "productId", rating) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [orderId, productId, rating])).rows[0];
  },
  readOne: async id => {
    return (await client.query(`SELECT * FROM "lineItems" WHERE id = $1`, [id]))
      .rows[0];
  },
};

module.exports = lineItems;

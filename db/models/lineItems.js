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
  update: async updatedItem => {
    return (
      await client.query(
        `UPDATE "lineItems" SET "orderId" = $1, "productId" = $2, quantity = $3, rating = $4 WHERE id = $5`,
        [
          updatedItem.orderId,
          updatedItem.productId,
          updatedItem.quantity,
          updatedItem.rating,
          updatedItem.id,
        ]
      )
    ).rows[0];
  },
};

module.exports = lineItems;

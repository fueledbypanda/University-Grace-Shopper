const client = require('../client');

const userProducts = {
  read: async () => {
    const SQL = 'SELECT * from user_products';
    return (await client.query(SQL)).rows;
  },
  create: async userProduct => {
    const SQL = `INSERT INTO user_products("userId", "productId") values($1, $2) returning *`;
    return (
      await client.query(SQL, [userProduct.userId, userProduct.productId])
    ).rows[0];
  },

  update: async updatedUserProduct => {
    return (
      await client.query(`UPDATE orders SET rating = $1 WHERE id = $2`, [
        updatedUserProduct.rating,
        updatedUserProduct.id,
      ])
    ).rows[0];
  },
};

module.exports = userProducts;

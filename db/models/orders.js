const client = require('../client');

const orders = {
  read: async () => {
    return (await client.query('SELECT * from orders')).rows;
  },
  create: async ({ userId }) => {
    const SQL = `INSERT INTO orders("userId") values($1) returning *`;
    return (await client.query(SQL, [userId])).rows[0];
  },
  update: async updatedOrder => {
    return (
      await client.query(`UPDATE orders SET address = $1 WHERE id = $2`, [
        updatedOrder.address,
        updatedOrder.id,
      ])
    ).rows[0];
  },
};

module.exports = orders;

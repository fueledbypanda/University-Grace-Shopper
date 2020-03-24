const client = require('../client');

const saved = {
  read: async()=> {
    return (await client.query('SELECT * from saves')).rows;
  },
  create: async( userId, productId )=> {
    const SQL = `INSERT INTO saves("userId", "productId") values($1, $2) returning *`;
    return (await client.query(SQL, [userId, productId])).rows[0];
  },
  delete: async(id) => {
    const sql = `DELETE FROM saves WHERE id = $1`
    await client.query(sql, [id])
  }
};

module.exports = saved;

const client = require('../client');

const promos = {
  read: async()=> {
    return (await client.query('SELECT * from promos')).rows;
  },
  create: async( code, discount )=> {
    const SQL = `INSERT INTO promos(code, discount) values($1, $2) returning *`;
    return (await client.query(SQL, [code, discount])).rows[0];
  },
  delete: async(id) => {
    const sql = `DELETE FROM promos WHERE id = $1`
    await client.query(sql, [id])
  }
};

module.exports = promos;
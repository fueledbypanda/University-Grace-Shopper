const client = require('../client');

const lastViewed = {
  read: async ( userId ) => {
    
    return (await client.query('SELECT * from lastViewed')).rows[0];
  },
  set : async (products, userId) => {
    const sql = `UPDATE lastViewed SET list = $1 WHERE userId = $2 returning *`
    return (await client.query(sql, [products, userId])).rows[0]
  },
};

module.exports = lastViewed;

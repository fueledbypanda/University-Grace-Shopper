const client = require("../client");

const products = {
  read: async () => {
    return (await client.query("SELECT * from products")).rows;
  },
  create: async ({ name, price, image, department, material, adjective }) => {
    const SQL = `INSERT INTO products(name, price, image, department, material, adjective) values($1, $2, $3, $4, $5, $6) returning *`;
    return (
      await client.query(SQL, [
        name,
        price,
        image,
        department,
        material,
        adjective
      ])
    ).rows[0];
  },

  changeInventory : async(productId, total, op) => {
    if(op === '-') {
      const sql = `UPDATE products SET inventory=$1 WHERE id = $2 returning *`
      const response = await client.query(sql, [total, productId])
      return response.rows[0]
    } else if(op === '+') {
      const sql = `UPDATE products SET inventory=$1 WHERE id = $2 returning *`
      const response = await client.query(sql, [total, productId])
      return response.rows[0]
    }
};

module.exports = products;

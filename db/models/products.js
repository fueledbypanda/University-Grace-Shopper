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
  }
};

module.exports = products;

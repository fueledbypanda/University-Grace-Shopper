const client = require('../client');
const { hash } = require('../auth');

const users = {
  read: async () => {
    return (await client.query('SELECT * from users')).rows;
  },
  readOne: async id => {
    return (await client.query(`SELECT * FROM users WHERE id = $1`, [id]))
      .rows[0];
  },
  update: async updatedUser => {
    return (
      await client.query(
        `UPDATE users SET username = $1, password = $2, role = $3, addresses = $4 WHERE id = $5`,
        [
          updatedUser.username,
          updatedUser.password,
          updatedUser.role,
          updatedUser.addresses,
          updatedUser.id,
        ]
      )
    ).rows[0];
  },
  create: async ({ username, password, role, addresses }) => {
    const SQL = `INSERT INTO users(username, password, role, addresses) values($1, $2, $3, $4) returning *`;
    return (
      await client.query(SQL, [username, await hash(password), role, addresses])
    ).rows[0];
  },
};

module.exports = users;

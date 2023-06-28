const { mysqlConect } = require("./.env")

module.exports = {
  client: 'mysql',
  connection: mysqlConect,
  pool: {
    min: 0,
    max: 10
  }
};

const { Pool } = require('pg')
const { DATABASE_URL } = require('../utils/config')

const pool = new Pool({
  connectionString:
    'postgres://hsiwaanxgwajox:cacf3482f3f7e590dc16616cc5878c879ede16623cc0158d990c4f1223d73ecd@ec2-44-193-228-249.compute-1.amazonaws.com:5432/dck4joqqde7mcc',
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}

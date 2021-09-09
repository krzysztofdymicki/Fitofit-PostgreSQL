const { DATABASE_URL } = require('./config')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString:
    'postgres://hsiwaanxgwajox:cacf3482f3f7e590dc16616cc5878c879ede16623cc0158d990c4f1223d73ecd@ec2-44-193-228-249.compute-1.amazonaws.com:5432/dck4joqqde7mcc',
  ssl: {
    rejectUnauthorized: false,
  },
})

// const createTable = async () => {
//   try {
//     const result = await pool.query(`
//             SELECT * FROM users
//     `)
//     console.log(result)
//   } catch (error) {
//     console.log(error)
//   }
// }

// const createTable = async () => {
//   try {
//     const table = await pool.query(`CREATE TABLE users(
//   userId int generated always as identity,
//   username text not null,
//   passwordHash text not null
// )`)
// console.log(table)
//   } catch (error) {
//     console.log(error.message)
//   }
// }

const createActivitiesTable = async () => {
  try {
    const table = await pool.query(`CREATE table activities (
  activity_id int primary key GENERATED ALWAYS AS IDENTITY,
  activity_start text not null,
  activity_end text not null,
  activity_date date not null,
  activity_distance numeric(10,4) not null,
  user_id int not null references users(user_id)
)`)
    console.log(table)
  } catch (error) {
    console.log(error.message)
  }
}

const truncateTable = async () => {
  try {
    const truncate = await pool.query(
      `
        TRUNCATE TABLE users
      `
    )
  } catch (e) {
    console.log(e)
  }
}

const dropTable = async () => {
  try {
    const truncate = await pool.query(
      `
        DROP TABLE users
      `
    )
  } catch (e) {
    console.log(e)
  }
}

const createUsersTable = async () => {
  try {
    const table = await pool.query(
      `
        CREATE TABLE users (
          user_id int primary key GENERATED ALWAYS AS IDENTITY,
          username text not null,
          password_hash text not null
        )
      `
    )
  } catch (e) {
    console.log(e)
  }
}
createActivitiesTable()

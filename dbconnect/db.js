const {Pool} = require('pg')

const dbPool = new Pool({
    database: 'project_b39',
    port: 5432,
    user: 'postgres',
    password: 'irham2805'
})

module.exports = dbPool
module.exports = {
    mariadb: {
        database: 'auth',
        host: 'localhost',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
};
const Sequelize = require('sequelize');
const { mariadb } = require('./mariadb');

const sequelize = new Sequelize(mariadb.database, mariadb.username, mariadb.password, {
    host: mariadb.host,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true
    }
});

let connectionPromise = sequelize.authenticate().then(() => {
    console.log('Connection to the database has been established.');
    return sequelize;
}). catch((err) => {
    console.log('Unable to establish connection to the database.')
});

module.exports = {
    connect: connectionPromise,
    sequelize: sequelize
};
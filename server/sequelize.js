const Sequelize = require('sequelize');
const { mariadb } = require('./mariadb');

const sequelize = new Sequelize(mariadb.database, mariadb.username, mariadb.password, {
    host: mariadb.host,
    dialect: 'mysql',
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

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    }
});

const Profiles = sequelize.define('profiles', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: Users,
            key: Users.id
        }
    }
});

Profiles.belongsTo(Users);

let connectionPromise = sequelize.authenticate().then(() => {
    console.log('Connection to the database has been established.');
    return sequelize;
}).catch((err) => {
    console.log('Unable to establish connection to the database.')
});

module.exports = {
    connect: connectionPromise,
    sequelize: sequelize,
    Users,
    Profiles
};
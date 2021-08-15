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
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    }
});

const Pets = sequelize.define('pets', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER 
    },
    petName: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: true
        }
    }
});

Users.hasMany(Pets, {
    foreignKey: 'userId'
});
Pets.belongsTo(Users);

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
    Pets
};
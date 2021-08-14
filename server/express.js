require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const { Users, Profiles } = require('./sequelize');

app.use(session({
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    };
};

router.use(authenticate);

require('./passport');

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
});

app.get('/google/auth', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

app.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/pass',
    failureRedirect: '/fail'
}));

app.get('/email', (req, res) => {
    res.json(req.user.emails[0].value)
});

app.get('/pass', authenticate, (req, res) => {
    res.send('Passed');
});

app.get('/fail', (req, res) => {
    res.send('Failed');
});

app.get('/register', authenticate, (req,res) => {
    res.sendFile(path.resolve(__dirname, '../client/register.html'))
});

app.listen(process.env.PORT, () => {
    console.log(
        'Server is now running on: http://localhost:' + process.env.PORT
    );
});
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const router = express.Router();
const passport = require('passport');
const app = express();
const { Users, Pets } = require('./sequelize');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/fail');
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
    successRedirect: '/',
    failureRedirect: '/fail'
}));

app.get('/google/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/email', authenticate, (req, res) => {
    res.json(req.user.emails[0].value)
});

app.get('/pass', authenticate, (req, res) => {
    res.send('Passed');
});

app.get('/fail', (req, res) => {
    res.send('Failed');
});

app.get('/register', authenticate, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/register.html'))
});

app.post('/create', authenticate, async (req, res) => {
    await Users.findOrCreate({
        where: {
            email: req.body.email,
            username: req.body.username
        }
    }).then(res.redirect('/pass'));
});

app.get('/user/:username', async (req, res) => {
    const username = await Users.findOne({ where: { username: req.params.username }});
    if (username == null) {
        console.log('User not found.');
    } else {
        console.log('Found: ' + username.username);
    };
});

app.listen(process.env.PORT, () => {
    console.log(
        'Server is now running on: http://localhost:' + process.env.PORT
    );
});
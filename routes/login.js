import express from 'express';
import { readUsers } from '../helpers/userHelpers.js';

const loginRouter = express.Router();

loginRouter.get('/login', (req, res) => {
    res.status(200).render('login.ejs', {
        condition: '1 === 1',
    });
});

loginRouter.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const users = readUsers();

    const foundUser = users.find(u => u.user === user && u.pass === pass);
    if (foundUser) {
        res.status(200).send('<h1>Login Successful</h1>');
    } else {
        res.status(401).send('<h1>Invalid Username or Password</h1>');
    }
});

export { loginRouter };
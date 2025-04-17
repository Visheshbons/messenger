import express from 'express';
import { readUsers, writeUsers } from '../helpers/userHelpers.js';

const accountRouter = express.Router();

accountRouter.get('/newAccount', (req, res) => {
    res.status(200).render('createAccount.ejs', {
        condition: '1 === 1',
    });
});

accountRouter.post('/newAccount', (req, res) => {
    const { user, pass } = req.body;
    const users = readUsers();

    const userExists = users.some(u => u.user === user);
    if (userExists) {
        res.status(409).send('<h1>Username already exists</h1>');
    } else {
        users.push({ user, pass });
        writeUsers(users);
        res.status(201).send('<h1>Account Created Successfully</h1>');
    }
});

export { accountRouter };
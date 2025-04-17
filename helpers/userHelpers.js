import fs from 'fs';

const readUsers = () => {
    const data = fs.readFileSync('users.json', 'utf-8');
    return JSON.parse(data);
};

const writeUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

export { readUsers, writeUsers };
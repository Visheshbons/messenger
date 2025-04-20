// Imports all the neccecary data
import cookieParser from 'cookie-parser';
import express from 'express';
import chalk from 'chalk';
import fs from 'fs';

const postsFilePath = './posts.json';

// Function to load posts from the file
function loadPosts() {
    if (fs.existsSync(postsFilePath)) {
        const data = fs.readFileSync(postsFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
}

// Function to save posts to the file
function savePosts(posts) {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}

class Post {
    constructor(title, content, author, date = new Date().toISOString()) {
        this.title = title;
        this.content = content;
        this.date = date;
        this.author = author;
    };
};

let posts = loadPosts();


const userFilePath = './users.json';

function loadUsers() {
    if (fs.existsSync(userFilePath)) {
        const data = fs.readFileSync(userFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return[];
}

function saveUser(user) {
    fs.writeFileSync(userFilePath, JSON.stringify(user, null, 2), 'utf-8');
}

class User {
    constructor(username, password) {
        this.user = username;
        this.pass = password;
    };
};

let user = loadUsers();

// Optimized utility functions and variable declarations
const app = express();
const port = process.env.PORT || 3000;

const log = console.log;
const info = (message) => log(`${chalk.blue("Info:")} ${chalk.white(message)}`);
const important = (message) => log(`${chalk.bgBlue.whiteBright("IMPORTANT:")} ${chalk.blue(message)}`);

const green = (message) => log(`${chalk.green(message)}`);

const err = (message, urgency = "low") => {
    const prefix = urgency === "high" ? "FATAL:" : "Error:";
    log(`${chalk.bgRed.yellowBright(prefix)} ${chalk.red(message)}`);
};

const warn = (message, urgency = "low") => {
    const prefix = urgency === "high" ? "WARN:" : "Warn:";
    log(`${chalk.bgYellow(prefix)} ${chalk.yellow(message)}`);
};

function dateConversion() {
    document.addEventListener('DOMContentLoaded', () => {
        const dateElements = document.querySelectorAll('[data-post-date]');
        dateElements.forEach(element => {
            const isoDate = element.getAttribute('data-post-date');
            const localDate = new Date(isoDate).toLocaleString();
            element.textContent = localDate;
        });
    });
};

export { app, port, express, log, err, warn, info, important, green, fs, loadPosts, savePosts, Post, posts, cookieParser, loadUsers, saveUser, User, user };
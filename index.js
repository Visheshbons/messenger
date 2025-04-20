// Import necessary files
import { app, port, express, log, err, warn, info, important, green, fs, loadPosts, savePosts, Post, posts, cookieParser } from './appConfig.js';
// Import a profanity filter library
import { Filter } from 'bad-words';

// Initialize the filter
const filter = new Filter();
const Defaltstrikes = 3; // Default strikes

// Middleware to parse JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to check strikes before accessing /post
app.get('/', (req, res) => {
    res.status(200).render("index.ejs", {
        posts: posts,
    });
}).get('/post', (req, res) => {
    let strikes = parseInt(req.cookies.strikes);
    if (strikes <= 0) {
        return res.status(403).send('You have been blocked from accessing this page due to repeated violations.');
    };
    res.status(200).render("post.ejs");
}).post('/post', (req, res) => {

    let { title, content, author } = req.body;

    let strikes = parseInt(req.cookies.strikes);
    if (strikes === undefined) {
        res.cookie('strikes', Defaltstrikes, { httpOnly: true }).redirect("/post");
        return;
    } else {
        if (strikes <= 0) {
            return res.status(403).send('You have been blocked from posting due to repeated violations.');
        };

        // Check for missing fields
        if (!title || !content || !author) {
            return res.status(400).send('Title, content, and author are required!');
        };

        // Check for profanity
        if (filter.isProfane(title) || filter.isProfane(content) || filter.isProfane(author)) {
            strikes--;
            res.cookie('strikes', strikes, { httpOnly: true });

            if (strikes <= 0) {
                return res.status(403).send('You have been blocked from posting due to repeated violations.');
            }

            return res.status(400).send(`Your post contains inappropriate language. You have ${strikes} strike(s) remaining.`);
        };
    };

    // Create and save the new post
    const newPost = new Post(title, content, author);
    posts.push(newPost);
    savePosts(posts);
    info(`New post added: ${title}`);
    res.status(201).redirect("/");
}).get('/myIP', (req, res) => {
    const localIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const publicIP = req.socket.remoteAddress;
    res.send(`Your local IP address is: ${localIP}<br>Your public IP address is: ${publicIP}`);
}).use((req, res) => {
    const isCriticalRoute = ["/", "/post"].includes(req.originalUrl);
    res.status(404).send("ERROR_404_PAGE_NOT_FOUND");
    err(`404: ${req.originalUrl}`, isCriticalRoute ? "high" : "low");
    warn("ERR404 catcher activated", "low");
}).listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

setInterval(() => {
    fetch("https://diminished-rights.onrender.com")
        .catch(err => {
            console.error("Ping failed:", err);
        });
}, 60000); // 60,000 milliseconds = 1 minute
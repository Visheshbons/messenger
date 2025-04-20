// Import necessary files
import { app, port, express, log, err, warn, info, important, green, fs, loadPosts, savePosts, Post, posts, cookieParser, User, user } from './appConfig.js';
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
});

app.get('/post', (req, res) => {
    res.status(200).render("post.ejs");
});

app.post('/post', (req, res) => {

    let { title, content, author } = req.body;

    app.redirect("/post");

    // Check for missing fields
    if (!title || !content || !author) {
        return res.status(400).send('Title, content, and author are required!');
    };

    // Check for profanity
    if (filter.isProfane(title) || filter.isProfane(content) || filter.isProfane(author)) {
    return res.status(400).send(`Your post contains inappropriate language.`);
    };

    // Create and save the new post
    const newPost = new Post(title, content, author);
    posts.push(newPost);
    savePosts(posts);
    info(`New post added: ${title}`);
    res.status(201).redirect("/");
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {

    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Both username and password are required!');
    };

    if (username !== User.user || password !== User.pass) {
        return res.redirect('/create-account');
    } else {
        res.status(200).cookie('user', username).redirect('/');
    };
});

app.get('/myIP', (req, res) => {
    const localIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const publicIP = req.socket.remoteAddress;
    res.send(`Your local IP address is: ${localIP}<br>Your public IP address is: ${publicIP}`);
});

app.use((req, res) => {
    const isCriticalRoute = ["/", "/post"].includes(req.originalUrl);
    res.status(404).send("ERROR_404_PAGE_NOT_FOUND");
    err(`404: ${req.originalUrl}`, isCriticalRoute ? "high" : "low");
    warn("ERR404 catcher activated", "low");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
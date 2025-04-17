import express from 'express';
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('This site does not exist yet');
}).use((req, res, next) => {
    res.status(404).send('<pre>ERR_404_NOT_FOUND: The requested URL was not found on this server.</pre>');
}).use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('<pre>ERR_500_INTERNAL_SERVER_ERROR: Something went wrong on the server.</pre>');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
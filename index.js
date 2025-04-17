import express from 'express';
import { loginRouter } from './routes/login.js';
import { accountRouter } from './routes/account.js';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', loginRouter);
app.use('/', accountRouter);

app.get('/', (req, res) => {
    res.status(200).render('index.ejs', {
        condition: '1 === 1',
    });
});

app.use((req, res, next) => {
    res.status(404).send('<pre>ERR_404_NOT_FOUND</pre>');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('<pre>ERR_500_INTERNAL_SERVER_ERROR</pre>');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
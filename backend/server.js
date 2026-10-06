import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';
import Database from './config/db.js';

const app = express();

const port = 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(router);

app.get('/', (req, res) => {
    res.send('ArtGestão funcionando!');
});

Database.connect();

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
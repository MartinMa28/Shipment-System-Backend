import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routers/user';
import stateSyncRouter from './routers/state-sync-job';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/state-sync', stateSyncRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));

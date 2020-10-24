import express from 'express';
import bodyParser from 'body-parser';
// import passport from 'passport';
// import session from 'express-session';
import dotenv from 'dotenv';
import userRouter from './routers/user';
import shipmentRouter from './routers/shipment';
import stateSyncRouter from './routers/state-sync-job';
import authRouter from './routers/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// ejs template only for testing
app.set('view-engine', 'ejs');

app.use(bodyParser.json());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use('/user', userRouter);
app.use('/state-sync', stateSyncRouter);
app.use('/shipment', shipmentRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'Yilin Ma' });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));

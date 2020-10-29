import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import flash from 'express-flash';
import dotenv from 'dotenv';
import userRouter from './routers/user';
import shipmentRouter from './routers/shipment';
import stateSyncRouter from './routers/state-sync-job';
import authRouter from './routers/auth';
import initializePassport from './passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// ejs template only for testing
app.set('view-engine', 'ejs');

initializePassport(passport);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/state-sync', stateSyncRouter);
app.use('/shipment', shipmentRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index.ejs', { name: req.user.username });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));

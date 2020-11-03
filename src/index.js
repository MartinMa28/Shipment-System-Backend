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
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

initializePassport(passport);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  if (!req.isAuthenticated() && req.path === '/shipment-list') {
    console.log('Not logged in!');
    res.redirect('/login');
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, '../build')));
app.use('/user', userRouter);
app.use('/state-sync', stateSyncRouter);
app.use('/shipment', shipmentRouter);
app.use('/auth', authRouter);
app.use(cors());

app.get('/session-test', (req, res) => {
  if (req.user) {
    res.status(200).json({
      username: req.user.username,
      user_id: req.user._id.toString(),
    });
  } else {
    res.status(200).json({
      username: 'session is not working',
      user_id: 'session is not working',
    });
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`));

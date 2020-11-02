import express from 'express';
import passport from 'passport';
import { checkNotAuthenticated } from '../passport';

const router = express.Router();

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: 'Authorization Failure',
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Authorized',
        username: user.username,
        userId: user._id,
      });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  try {
    req.logOut();
    res.status(200).json({ message: 'Log out successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Internal error: ${err}` });
  }
});

router.get('/authenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(200).json({ authenticated: false });
  }
});

export default router;

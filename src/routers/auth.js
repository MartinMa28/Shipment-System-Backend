import express from 'express';
import passport from 'passport';
import { checkNotAuthenticated } from '../passport';

const router = express.Router();

// router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// router.get('/google/callback', { failureRedirect: '/login' }, (req, res) => {
//   res.redirect('/');
// });

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
      });
    });
  })(req, res, next);
});

export default router;

import express from 'express';
import passport from 'passport';

const router = express.Router();

// router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// router.get('/google/callback', { failureRedirect: '/login' }, (req, res) => {
//   res.redirect('/');
// });

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

export default router;

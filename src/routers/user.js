import express from 'express';
import withDb from '../database/dbUtils';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.post('/register', async (req, res) => {
  await withDb(async (db) => {
    console.log(req.body);
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPwd);
    await db.collection('users').insertOne({
      username: req.body.username,
      email: req.body.email,
      password: hashedPwd,
    });
  });
  res.redirect('/auth/login');
});

export default router;

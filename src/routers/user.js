import express from 'express';
import withDb from '../database/dbUtils';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
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

    res.status(200).json({ message: 'Registered a new user.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Internal Error: ${err}` });
  }
});

export default router;

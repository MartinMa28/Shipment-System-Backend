import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Hello state-sync router!');
});

export default router;

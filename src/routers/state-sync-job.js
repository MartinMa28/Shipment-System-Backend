import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const config = {
    method: 'get',
    url:
      'http://api.shipengine.com/v1/tracking?carrier_code=usps&tracking_number=9374889676091289203070',
    headers: {
      'API-KEY': 'TEST_fF1MGE2gp9GFuBAKcmyKDZ9gWoYpGRAbjGKo7jpTiPk',
    },
  };

  try {
    const response = await axios(config);
    res.status(200).send(response.data);
  } catch (err) {
    console.log(err);
  }
});

export default router;

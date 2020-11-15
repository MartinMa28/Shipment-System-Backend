import express from 'express';

const router = express.Router();
const connectDB = require('../database/db').default;

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

router.use(checkAuthenticated);

// get all shipments with this userID
router.get('/', async (req, res) => {
  const myDB = await connectDB();
  const userID = req.user._id.toString();
  const data = await myDB.getShipments(userID);
  res.json(data);
});

// create a new shipment
// available carrier: usps, fedex, ups
router.post('/new', async (req, res) => {
  const myDB = await connectDB();
  const newShipment = {
    user_id: req.user._id.toString(),
    tracking_num: req.body.tracking_num.toString(),
    carrier: req.body.carrier,
    comment: req.body.comment,
    order_url: req.body.order_url,
    active: true,
    status: 'NY',
    carrier_status_desc: 'Waiting to be updated...',
    events: [],
  };
  const data = await myDB.addShipment(newShipment);
  if (data.result.ok === 1) {
    res.json(data.ops);
  } else {
    res.json({});
  }
});

// update an existing shipment(deactivate it)
router.put('/:id', async (req, res) => {
  const myDB = await connectDB();
  const documentID = req.params.id;
  const dbResult = await myDB.updateShipment(documentID);
  if (dbResult.result.ok === 1) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// delete a shipment
router.delete('/:id', async (req, res) => {
  const myDB = await connectDB();
  const documentID = req.params.id;
  const dbResult = await myDB.deleteShipment(documentID);
  if (dbResult.result.ok === 1) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

export default router;

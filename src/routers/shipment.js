import express from 'express';

const router = express.Router();
const connectDB = require('../database/db').default;

// get all shipments with this userID
router.get('/:id', async (req, res, next) => {
	const myDB = await connectDB()
	const userID = parseInt(req.params.id);
	const data = await myDB.getShipments(userID);
	res.json(data);
});

// create a new shipment
router.post('/new', async (req, res, next) => {
	const myDB = await connectDB();
	const newShipment = {
		trackingNum: req.body.trackingNum,
		comments: req.body.comments,
		userID: req.body.userID,
		active: true
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
	const id = req.params.id;
	const dbResult = await myDB.updateShipment(id);
	if (dbResult.result.ok === 1) {
		res.json({'success': true});
	} else {
		res.json({'success': false});
	}
});
   
// delete a shipment
router.delete('/:id', async (req, res) => {
	const myDB = await connectDB();
	const id = req.params.id;
	const dbResult = await myDB.deleteShipment(id);
	if (dbResult.result.ok === 1) {
		res.json({'success': true});
	} else {
		res.json({'success': false});
	}
});

export default router;
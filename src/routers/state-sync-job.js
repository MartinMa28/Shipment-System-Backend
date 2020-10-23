import express from 'express';
import { MongoClient } from 'mongodb';
import amqp from 'amqplib';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect('mongodb://db:27017', {
      useUnifiedTopology: true,
    });
    const db = client.db('tracking_database');

    const cursor = db.collection('shipments').find({ active: { $eq: true } });
    const conn = await amqp.connect('amqp://rabbit');
    const ch = await conn.createChannel();
    const queue = 'shipments';

    const messages = [];
    await cursor.forEach((shipment) =>
      messages.push(
        `${shipment._id},${shipment.carrier},${shipment.tracking_num}`
      )
    );

    for (const message of messages) {
      await ch.assertQueue(queue, {
        durable: false,
      });

      ch.sendToQueue(queue, Buffer.from(message));
      console.log(`[AMQP] Sent ${message}`);
    }

    await ch.close();
    await conn.close();
    await client.close();
    res.status(200).send('Published to consumer.');
  } catch (error) {
    res.status(500).json({
      message: 'Failed to synchronize shipment states',
      errorMessage: error.message,
    });
  }
});

export default router;

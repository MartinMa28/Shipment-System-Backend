import express from 'express';
import { MongoClient } from 'mongodb';
import amqp from 'amqplib';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    });
    const db = client.db('my-blog');

    const cursor = db.collection('articles').find({});
    await cursor.forEach(async (shipment) => {
      const conn = await amqp.connect('amqp://localhost');
      const ch = await conn.createChannel();
      const queue = 'shipments';
      const msg = shipment.name;

      await ch.assertQueue(queue, {
        durable: false,
      });

      await ch.sendToQueue(queue, Buffer.from(msg));
      console.log(`[AMQP] Sent ${msg} BOTTOM`);

      await ch.close();
      await conn.close();
    });

    client.close();
    res.status(200).send('Published article names to consumer.');
  } catch (error) {
    res.status(500).json({
      message: 'Failed to synchronize shipment states',
      errorMessage: error.message,
    });
  }
});

export default router;

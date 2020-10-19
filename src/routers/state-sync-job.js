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
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    const queue = 'shipments';

    const messages = [];
    await cursor.forEach((shipment) => messages.push(shipment.name));

    for (const message of messages) {
      await ch.assertQueue(queue, {
        durable: false,
      });

      ch.sendToQueue(queue, Buffer.from(message));
      console.log(`[AMQP] Sent ${message} BOTTOM`);
    }

    await ch.close();
    await conn.close();
    await client.close();
    res.status(200).send('Published article names to consumer.');
  } catch (error) {
    res.status(500).json({
      message: 'Failed to synchronize shipment states',
      errorMessage: error.message,
    });
  }
});

export default router;

import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const processShipment = async (shipmentId, carrier, trackingNum) => {
  const config = {
    method: 'get',
    url: `http://api.shipengine.com/v1/tracking?carrier_code=${carrier}&tracking_number=${trackingNum}`,
    headers: {
      'API-KEY': `${process.env.SHIPENGINE_API_KEY}`,
    },
  };

  try {
    const resp = await axios(config);
    const respData = resp.data;
    const client = await MongoClient.connect('mongodb://db:27017', {
      useUnifiedTopology: true,
    });
    const db = client.db('tracking_database');
    const shipmentRecord = await db.collection('shipments').findOne({
      _id: ObjectId(shipmentId),
    });

    if (
      shipmentRecord.status === respData.status_code &&
      shipmentRecord.carrier_status_desc === respData.carrier_status_description
    ) {
      console.log(`No change on shipment ${shipmentId}`);
    } else {
      db.collection('shipments').updateOne(
        {
          _id: ObjectId(shipmentId),
        },
        {
          $set: {
            status: respData.status_code,
            carrier_status_desc: respData.carrier_status_description,
            events: respData.events,
          },
        }
      );
      console.log(`Updated shipment ${shipmentId}`);
    }
  } catch (err) {
    console.log(err);
    console.log(
      `Failed to update shipment ${shipmentId}: ${carrier} ${trackingNum}`
    );
  }
};

const run = async () => {
  const conn = await amqp.connect('amqp://rabbit');
  const ch = await conn.createChannel();
  const queue = 'shipments';

  await ch.assertQueue(queue, {
    durable: false,
  });

  console.log(`[AMQP] Waiting for messages in ${queue}. To exit press CTRL+C`);

  await ch.consume(
    queue,
    async (msg) => {
      const message = msg.content.toString();
      const shipmentId = message.split(',')[0];
      const carrier = message.split(',')[1];
      const trackingNum = message.split(',')[2];
      console.log(
        `[AMQP] Received shipment ${shipmentId}: ${carrier} ${trackingNum}`
      );
      processShipment(shipmentId, carrier, trackingNum);
    },
    {
      noAck: true,
    }
  );
};

run();

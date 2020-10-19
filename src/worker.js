import axios from 'axios';
import { MongoClient } from 'mongodb';
import amqp from 'amqplib/callback_api';

const sendRequest = async function () {
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
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
};

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queue = 'shipments';

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(
      `[AMQP] Waiting for messages in ${queue}. To exit press CTRL+C`
    );

    channel.consume(
      queue,
      async (msg) => {
        const articleName = msg.content.toString();
        console.log(`[AMQP] Received ${articleName}`);
        sendRequest();
        const client = await MongoClient.connect('mongodb://localhost:27017', {
          useUnifiedTopology: true,
        });
        const db = client.db('my-blog');

        const articleInfo = await db
          .collection('articles')
          .findOne({ name: articleName });
        await db.collection('articles').updateOne(
          { name: articleName },
          {
            $set: {
              comments: articleInfo.comments.concat({
                username: 'Yilin',
                text: 'Comment from rabbitmq consumer.',
              }),
            },
          }
        );
      },
      {
        noAck: true,
      }
    );
  });
});

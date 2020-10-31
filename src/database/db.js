const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const connectDB = async () => {
  const myDB = {};
  const uri = 'mongodb://db:27017';

  myDB.getShipments = async (userID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('tracking_database');
    const col = db.collection('shipments');

    const query = { user_id: userID};
    return col
      .find(query)
      .sort({ _id: -1 })
      .toArray()
      .finally(() => client.close());
  };

  myDB.addShipment = async (newShipment) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('tracking_database');
    const col = db.collection('shipments');
    return await col.insertOne(newShipment).finally(() => client.close());
  };

  myDB.deleteShipment = async (documentID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('tracking_database');
    const col = db.collection('shipments');

    const query = { _id: ObjectID(documentID) };
    return await col.deleteOne(query).finally(() => client.close());
  };

  myDB.updateShipment = async (documentID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('tracking_database');
    const col = db.collection('shipments');

    const filter = { _id: ObjectID(documentID) };
    const updateDoc = { $set: { active: false } };
    return col.updateOne(filter, updateDoc).finally(() => client.close());
  };
  return myDB;
};

export default connectDB;

// /lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;

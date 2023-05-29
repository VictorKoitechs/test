import mongoDb from "mongodb";

const { MongoClient } = mongoDb;

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("Cluster0");

export default db;

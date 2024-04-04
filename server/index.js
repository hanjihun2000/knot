const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const userRouter = require('./routes/users');
// const mongoose = require('mongoose');

const PORT = 8000;

const app = express();


const uri = "mongodb+srv://admin1:1234567890@knot-cluster.ggtkwpg.mongodb.net/?retryWrites=true&w=majority&appName=knot-cluster";
const client = new MongoClient(uri, { 
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

client.connect();

// async function listDatabases(client){
// 	databasesList = await client.db().admin().listDatabases();
// 	console.log("Databases:");
// 	databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };
// listDatabases(client);

// // Fetch first 10 entries from a specified collection in a given database
// async function getListings(client, dbName, collectionName) {
// 	const collection = client.db(dbName).collection(collectionName);
// 	const listings = await collection.find().limit(10).toArray();
// 	return listings;
//   }
  
// // API endpoint to fetch listings data
// app.get("/api/listings/:dbName/:collectionName", async (req, res) => {
// try {
// 	const dbName = req.params.dbName;
// 	const collectionName = req.params.collectionName;
// 	console.log(`Fetching listings from ${dbName} in collection ${collectionName}`);
// 	const listings = await getListings(client, dbName, collectionName);
// 	res.json(listings);
// } catch (err) {
// 	console.error(err);
// 	res.status(500).json({ error: 'Server error' });
// }
// });

//use users route
app.use('/api/users', require('./routes/users'));



app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

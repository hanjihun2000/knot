const express = require("express");

const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
require('dotenv').config()
const uri = process.env.ATLAS_URI;
const { MongoClient, ServerApiVersion } = require('mongodb');
async function checkDBConnection() {
	try {
		const client = new MongoClient(uri, {
		  serverApi: ServerApiVersion.v1,
		});
		await client.connect();
		console.log("Connected to MongoDB");
		client.close();
	  } catch (err) {
		console.error("Failed to connect to MongoDB", err);
	  }
};
checkDBConnection();

mongoose.connect(uri, { 
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

module.exports = mongoose;
const userapiRouter = require("./api/userapi");
const followapiRouter = require("./api/followapi");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/userapi", userapiRouter);
app.use("/api/followapi", followapiRouter);

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
	// admin user account upon server starts
	// const admin = new userSchema({
	// 	username: "admin",
	// 	password: "admin",
	// 	email: "admin@example.com",
	// 	accountType: "admin",
	// 	profilePicture: null,
	// 	bio: null,
	// 	theme: null,
	// 	followers: [],
	// 	following: []
	// });
	// admin.save();
});
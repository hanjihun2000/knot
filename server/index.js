const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
require("dotenv").config()
const uri = process.env.ATLAS_URI;
const { MongoClient, ServerApiVersion } = require('mongodb');
async function checkDBConnection() {
	try {
		const client = new MongoClient(uri, { 
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			}
		});
		client.connect(async (err) => {
			if (err) throw err;
			client.close();
		});
		console.log("Connected to MongoDB");
	}
	catch (err) {
		console.error(err);
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
const postapiRouter = require("./api/postapi");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/userapi", userapiRouter);
app.use("/api/postapi", postapiRouter);

// I implemented the route so the insert function may not work if there is no request from api
// you can uncomment this code to test the insert function

// const User = require("./models/user");
// async function register(username, password, email){
// 	const userExists = await User.exists({ username: username });
// 	console.log(userExists);
// 	if (userExists) {
// 		// if the username is already taken, return an error
// 		console.log("UsernameExistsError!");
// 	} else {
// 		// create a new user account
// 		const user = new User({
// 			username: username,
// 			password: password,
// 			email: email,
// 			accountType: "user",
// 			profilePicture: null,
// 			bio: null,
// 			theme: null,
// 			followers: [],
// 			following: []
// 		});
// 		user.save();
// 		console.log("User account created successfully!");
// 	}
// }
// register("test", "test", "test@example.com");

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

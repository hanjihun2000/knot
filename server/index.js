// Importing required modules
var express = require("express");
var cors = require("cors");
require("dotenv").config();
var app = express();
var PORT = 8000;
var mongoose = require("mongoose");
var uri = process.env.ATLAS_URI;
var { MongoClient, ServerApiVersion } = require("mongodb");

// Function to check the MongoDB connection
async function checkDBConnection() {
  try {
    // Creating a new MongoDB client
    const client = new MongoClient(uri, {
      serverApi: ServerApiVersion.v1,
    });
    // Attempting to connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");
    // Closing the connection
    client.close();
  } catch (err) {
    // Logging any connection errors
    console.error("Failed to connect to MongoDB", err);
  }
}
// Calling the function to check the MongoDB connection
checkDBConnection();

// Enabling CORS for the server
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Connecting to MongoDB using Mongoose
mongoose.connect(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
var db = mongoose.connection;
// Logging any connection errors
db.on("error", (error) => console.error(error));
// Logging a successful connection
db.once("open", () => console.log("Connected to Database"));

// Exporting the Mongoose instance
module.exports = mongoose;

// Importing the routers for different parts of the API
const userapiRouter = require("./api/userapi");
const followapiRouter = require("./api/followapi");
const postapiRouter = require("./api/postapi");
const commentapiRouter = require("./api/commentapi");
const adminapiRouter = require("./api/adminapi");
const messageRouter = require("./api/messageapi");

// Enabling JSON and URL-encoded body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serving static files from the "public" directory
app.use(express.static("public"));

// Using the imported routers
app.use("/api/userapi", userapiRouter);
app.use("/api/postapi", postapiRouter);
app.use("/api/commentapi", commentapiRouter);
app.use("/api/followapi", followapiRouter);
app.use("/api/adminapi", adminapiRouter);
app.use("/api/messageapi", messageRouter);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

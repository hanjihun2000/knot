const express = require("express");
const app = express();
const PORT = 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin1:1234567890@knot-cluster.ggtkwpg.mongodb.net/?retryWrites=true&w=majority&appName=knot-cluster";
async function connectToMongoDB() {
	try {
		const client = new MongoClient(uri, { 
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			}
		});
		await client.connect();
		console.log("Connected to MongoDB");
	}
	catch (err) {
		console.error(err);
	}
};
connectToMongoDB();

app.get("/api", (req, res) => {
	res.json({ message: "API Working" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

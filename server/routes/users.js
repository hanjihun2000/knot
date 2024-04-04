const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

//get mongo client
const uri = "mongodb+srv://admin1:1234567890@knot-cluster.ggtkwpg.mongodb.net/?retryWrites=true&w=majority&appName=knot-cluster";
const client = new MongoClient(uri, { 
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});
client.connect();

// //test api
// router.get('/', (req, res) => {
//     res.send('Hello from users route');
// });

async function getListings(client, dbName, collectionName) {
	const collection = client.db(dbName).collection(collectionName);
	const listings = await collection.find().limit(10).toArray();
	return listings;
}
  
// API endpoint to fetch listings data
router.get("/fetchAllUsers", async (req, res) => {
    try {
        const listings = await getListings(client, 'app', 'users');
        res.json(listings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get("/fetchUser/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const collection = client.db('app').collection('users');
        const user = await collection.findOne({ username:
            username });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.get("/register/:username/:password/:email", async (req, res) => {
    try {
        const username = req.params.username;
        const password = req.params.password;
        const email = req.params.email;
        const collection = client.db('app').collection('users');
        const user = await collection.insertOne({ 
            username: username,
            password: password,
            email: email,
            accountType: 'user',
        });
        res.json({ userId: user._id }); // respond with user id
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})


module.exports = router;
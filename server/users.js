const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion} = require('mongodb');
const { User } = require('./models');



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

router.post('/register/:username/:password/:email', async (req, res) => {
    try {
      const { username, password, email } = req.params;
      const collection = client.db('app').collection('users');
  
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Create a new user
      const newUser = new User({
        username: username,
        password: password,
        email: email,
      });
  
      console.log(newUser)
      // Save the new user to the database
      const savedUser = await newUser.save();
  
      // Return the saved user as a response
      res.status(201).json(savedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

router.get("/login/:username/:password", async (req, res) => {
    try {
        const username = req.params.username;
        const password = req.params.password;
        const collection = client.db('app').collection('users');
        const user = await collection.findOne({ 
            username: username
        });
        if (user.password === password) {
            res.json({ userId: user._id });
        } else {
            res.status(401).json({ error: 'Invalid login' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.get("/logout/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const collection = client.db('app').collection('users');
        const user = await collection
            .findOne({ username: username });
        if (user) {
            res.json({ message: 'User logged out' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})




module.exports = router;
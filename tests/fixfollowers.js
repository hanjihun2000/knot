//connect to mongoose database

const mongoose = require('mongoose');

//get uri from ATLAS_URI on machine
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true });

//fetch connection
const connection = mongoose.connection;

//open connection
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

//fetch user model
const User = require("../server/models/user");

async function fixFollowers() {
    try {
        // Fetch all users
        const users = await User.find();

        // Perform operations on users
        users.forEach(user => {
            //reset followers and following
            user.followers = [];
            user.following = [];
            //save user
            user.save();
        });

        console.log('Operation completed successfully');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Close the connection to the database
        mongoose.connection.close();
    }
}

// Call the function
fixFollowers();

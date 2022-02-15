// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;


// Start up an instance of app

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// send index.html at home route
app.get('/',(req,res) => res.sendFile(__dirname+'/website/index.html'));

// handling data sent from client side
app.post('/add', ( req , res )=> projectData = req.body);

// sending data to client side
app.get ('/all',(req,res)=> res.send(projectData))

// Setup Server
app.listen(port , ()=> console.log(`server is running on port: ${port}`));



const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const cron = require('node-cron');
require('dotenv').config();
const nodemailer = require('nodemailer');
const app = express();
const { getEmails } = require('./index')

const corsOptions = {
  origin: process.env.ORIGIN
};


app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



//auth routes
app.use('/auth',authRoutes);
app.use('/api',apiRoutes);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to node application." });
});

// cron jobs 

// cron.schedule('*/30 * * * * *',   
//   getEmails);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
/*
 * Title: Main Server Page
 * Description: Handle all CRUD operations
 * Author: Nipen Paul
 * Date: 2023-09-28
 *
 */

// External Module
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Internal Module
const Product = require('./models/productModel');

// Import routers
const productsRouter = require('./routes/products');

const app = express();
app.use(bodyParser.json());
require('dotenv').config();

// Database Connection
// mongoose.connect('mongodb://localhost:27017/grocery', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
const MONGODB_CONNECT_URI = process.env.MONGODB_CONNECT_URI;
mongoose.connect(`${MONGODB_CONNECT_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', productsRouter); // Use the products router

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

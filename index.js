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

// Database Connection
// mongoose.connect('mongodb://localhost:27017/grocery', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb+srv://Nipen:174038@cluster0.uvc4mtm.mongodb.net/?retryWrites=true&w=majority', {
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./routes/auth.routes'); 
const foodRoutes = require('./routes/food.routes'); 

const app = express();
app.use(cookieParser()); //middleware to parse cookies
app.use(express.json());  //middleware- data in req.body to make it readable

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);


module .exports = app;
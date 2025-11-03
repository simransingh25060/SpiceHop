const express = require('express');
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./routes/auth.routes');  

const app = express();
app.use(cookieParser()); //middleware to parse cookies
app.use(express.json());  //middleware- data in req.body to make it readable

app.get('/', (req, res) => {
  res.send('Hello World!');
})
app.use('/api/auth', authRoutes);

module .exports = app;
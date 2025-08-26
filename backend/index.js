const express = require('express');
const cors = require('cors');
const app = express();
const initRoutes = require('./src/routes/index');
const connectionDatabase = require('./src/connect_db')
connectionDatabase();
require('dotenv').config();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials:true,
  methods:['GET','POST','PUT','DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Cổng chạy server
const PORT = process.env.PORT || 5000;

initRoutes(app)

// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

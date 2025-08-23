const express = require('express');
const cors = require('cors');
const app = express();

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

// Route đơn giản
app.get('/', (req, res) => {
  res.send('Hello Node.js!');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

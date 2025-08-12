const express = require('express');
const app = express();

// Cổng chạy server
const PORT = process.env.PORT || 3000;

// Route đơn giản
app.get('/', (req, res) => {
  res.send('Hello Node.js!');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

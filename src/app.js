const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Error handler: JSON tidak valid -> 400, selain itu -> 500
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Body request bukan JSON yang valid' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

module.exports = app;

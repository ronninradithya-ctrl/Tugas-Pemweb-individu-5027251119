const prisma = require('../lib/prisma');

const NOT_FOUND = { message: 'Produk tidak ditemukan' };

function parseId(value) {
  if (value === undefined || value === null || value === '') return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Mengembalikan { data } jika valid, atau { error } berisi pesan kesalahan.
function validateProductBody(body) {
  const { name, price } = body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    return { error: 'Nama produk wajib diisi' };
  }

  if (price === undefined || price === null || price === '' || !Number.isFinite(Number(price)) || Number(price) < 0) {
    return { error: 'Harga produk harus berupa angka >= 0' };
  }

  return { data: { name: name.trim(), price: Number(price) } };
}

async function getAllProducts(req, res) {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  return res.status(200).json(products);
}

async function getProductById(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'ID produk harus berupa bilangan bulat positif' });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json(NOT_FOUND);

  return res.status(200).json(product);
}

async function createProduct(req, res) {
  const { data, error } = validateProductBody(req.body);
  if (error) return res.status(400).json({ message: error });

  const product = await prisma.product.create({ data });
  return res.status(201).json(product);
}

// PUT /products          -> id dikirim di body (sama dengan POST + id)
// PUT /products/:id      -> id dari URL, juga diterima
async function updateProduct(req, res) {
  const rawId = req.params.id ?? req.body?.id;
  const id = parseId(rawId);
  if (id === null) {
    return res.status(400).json({ message: 'ID produk wajib diisi berupa bilangan bulat positif' });
  }

  const { data, error } = validateProductBody(req.body);
  if (error) return res.status(400).json({ message: error });

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json(NOT_FOUND);

  const product = await prisma.product.update({ where: { id }, data });
  return res.status(200).json(product);
}

async function deleteProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'ID produk harus berupa bilangan bulat positif' });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json(NOT_FOUND);

  await prisma.product.delete({ where: { id } });
  return res.status(200).json({ message: 'Produk berhasil dihapus', product: existing });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

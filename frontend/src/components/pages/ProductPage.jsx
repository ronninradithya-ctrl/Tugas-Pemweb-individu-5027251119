import { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import ProductList from '../organisms/ProductList';
import ProductFormModal from '../organisms/ProductFormModal';
import DeleteModal from '../organisms/DeleteModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productApi';

const sorters = {
  id: (a, b) => a.id - b.id,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  az: (a, b) => a.name.localeCompare(b.name, 'id'),
};

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selected, setSelected] = useState(null); // produk yang sedang diedit
  const [toDelete, setToDelete] = useState(null); // produk yang akan dihapus

  async function loadProducts() {
    setLoading(true);
    try {
      setProducts(await getProducts());
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Dijalankan sekali saat halaman pertama kali tampil
  useEffect(() => {
    loadProducts();
  }, []);

  function openAdd() {
    setSelected(null);
    setIsFormOpen(true);
  }

  function openEdit(product) {
    setSelected(product);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelected(null);
  }

  // Jika gagal, error dilempar ke modal supaya pesannya tampil di sana
  async function saveProduct(data) {
    if (data.id === null) {
      const created = await createProduct({ name: data.name, price: data.price });
      setProducts((prev) => [...prev, created]);
    } else {
      const updated = await updateProduct(data);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
    closeForm();
  }

  async function removeProduct(id) {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setToDelete(null);
  }

  const visible = products
    .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort(sorters[sort]);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Manajemen Produk</h1>
          <p className="subtitle">Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <Button variant="primary" onClick={openAdd}>+ Tambah Produk</Button>
      </header>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Cari nama produk..."
          aria-label="Cari nama produk"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Urutkan">
          <option value="id">Urut ID</option>
          <option value="cheap">Harga termurah</option>
          <option value="expensive">Harga termahal</option>
          <option value="az">Nama A-Z</option>
        </select>
        <span className="count">{products.length} produk</span>
      </div>

      {loading && <p className="empty">Memuat produk...</p>}

      {!loading && loadError && (
        <div className="alert">
          <span>{loadError}</span>
          <Button onClick={loadProducts}>Coba lagi</Button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <ProductList
            products={visible}
            emptyText={products.length === 0 ? 'Belum ada produk. Klik "Tambah Produk" untuk mulai.' : 'Tidak ada produk yang cocok.'}
            onEdit={openEdit}
            onDelete={setToDelete}
          />
          <p className="footnote">
            Menampilkan {visible.length} dari {products.length} produk
          </p>
        </>
      )}

      {isFormOpen && <ProductFormModal product={selected} onSave={saveProduct} onClose={closeForm} />}
      {toDelete && (
        <DeleteModal product={toDelete} onConfirm={removeProduct} onClose={() => setToDelete(null)} />
      )}
    </main>
  );
}

import { useState } from 'react';
import Modal from '../molecules/Modal';
import Field from '../atoms/Field';
import Button from '../atoms/Button';

// product = null -> mode tambah, product = object -> mode edit
export default function ProductFormModal({ product, onSave, onClose }) {
  const isEdit = product !== null;
  const [name, setName] = useState(isEdit ? product.name : '');
  const [price, setPrice] = useState(isEdit ? String(product.price) : '');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (name.trim() === '') newErrors.name = 'Nama produk wajib diisi.';
    if (price === '' || Number(price) <= 0) newErrors.price = 'Harga harus lebih dari 0.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setServerError('');
    try {
      await onSave({ id: isEdit ? product.id : null, name: name.trim(), price: Number(price) });
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal
      title={isEdit ? 'Edit Produk' : 'Tambah Produk'}
      subtitle={isEdit ? `ID: ${product.id}` : 'Masukkan informasi produk baru.'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field
          id="name"
          label="Nama Produk"
          placeholder="Contoh: Pulpen"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Field
          id="price"
          label="Harga (Rp)"
          type="number"
          placeholder="Contoh: 5000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
          hint="Harga harus lebih dari 0."
        />
        {serverError && <p className="alert">{serverError}</p>}
        <div className="modal-actions">
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import Modal from '../molecules/Modal';
import Button from '../atoms/Button';
import { formatPrice } from '../../utils/formatPrice';

export default function DeleteModal({ product, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleConfirm() {
    setDeleting(true);
    setServerError('');
    try {
      await onConfirm(product.id);
    } catch (err) {
      setServerError(err.message);
      setDeleting(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="delete-body">
        <div className="trash">🗑</div>
        <h2>Hapus Produk?</h2>
        <p className="subtitle">Produk yang dihapus tidak dapat dikembalikan.</p>
      </div>
      <div className="preview">
        <small>ID: {product.id}</small>
        <strong>{product.name}</strong>
        <span className="price">{formatPrice(product.price)}</span>
      </div>
      {serverError && <p className="alert">{serverError}</p>}
      <div className="modal-actions">
        <Button onClick={onClose}>Batal</Button>
        <Button variant="danger" onClick={handleConfirm} disabled={deleting}>
          {deleting ? 'Menghapus...' : 'Hapus Produk'}
        </Button>
      </div>
    </Modal>
  );
}

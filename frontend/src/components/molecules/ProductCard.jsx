import Button from '../atoms/Button';
import { formatPrice } from '../../utils/formatPrice';

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="card">
      <span className="badge">ID: {product.id}</span>
      <h3>{product.name}</h3>
      <p className="price">{formatPrice(product.price)}</p>
      <div className="actions">
        <Button variant="outline" onClick={() => onEdit(product)}>Edit</Button>
        <Button variant="danger-outline" onClick={() => onDelete(product)}>Hapus</Button>
      </div>
    </article>
  );
}

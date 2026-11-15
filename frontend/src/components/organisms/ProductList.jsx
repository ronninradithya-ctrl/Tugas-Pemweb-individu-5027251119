import ProductCard from '../molecules/ProductCard';

export default function ProductList({ products, emptyText, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="empty">{emptyText}</p>;
  }

  return (
    <section className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  );
}

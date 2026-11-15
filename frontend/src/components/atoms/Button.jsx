export default function Button({ variant = 'default', children, ...props }) {
  return (
    <button type="button" className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

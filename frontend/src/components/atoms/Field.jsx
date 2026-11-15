export default function Field({ id, label, error, hint, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={error ? 'invalid' : ''} {...inputProps} />
      <p className={error ? 'hint error' : 'hint'}>{error || hint}</p>
    </div>
  );
}

// Semua komunikasi dengan backend Express + Prisma ada di sini.
const BASE = '/products';
const OFFLINE = 'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan (npm start).';

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw new Error(OFFLINE);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || OFFLINE);
  return data;
}

export const getProducts = () => request(BASE);
export const createProduct = (p) => request(BASE, { method: 'POST', body: JSON.stringify(p) });
export const updateProduct = (p) => request(BASE, { method: 'PUT', body: JSON.stringify(p) });
export const deleteProduct = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });

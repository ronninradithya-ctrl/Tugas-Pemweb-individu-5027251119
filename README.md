# Tugas Express.js + Prisma — API Daftar Produk

API CRUD produk menggunakan Express.js, Prisma ORM (v7), dan PostgreSQL. Data tersimpan di database sehingga tidak hilang saat server di-restart.

## Persyaratan

- Node.js 20 atau lebih baru
- PostgreSQL yang sedang berjalan
- npm

## Menjalankan aplikasi

1. Pasang dependensi (otomatis menjalankan `prisma generate`):

   ```bash
   npm install
   ```

2. Buat database kosong, mis. `tugas_products`:

   ```bash
   psql -U postgres -c "CREATE DATABASE tugas_products;"
   ```

3. Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` sesuai database kamu.

4. Terapkan migration dan isi data awal:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Jalankan server:

   ```bash
   npm start
   ```

Server berjalan pada `http://localhost:3000`.

## Frontend React (Manajemen Produk)

Halaman web ada di folder `frontend/` (React + Vite) dan memakai API di atas.

**Mode pengembangan** (dua terminal):

```bash
npm start                  # terminal 1: backend di http://localhost:3000
npm run frontend:install   # sekali saja
npm run frontend:dev       # terminal 2: buka http://localhost:5173
```

**Satu server saja** (backend menyajikan hasil build):

```bash
npm run build:frontend
npm start                  # buka http://localhost:3000
```

Komponen disusun dengan Atomic Design: `atoms` (Button, Field), `molecules` (Modal, ProductCard), `organisms` (ProductList, ProductFormModal, DeleteModal), dan `pages` (ProductPage).

## Struktur proyek

```text
prisma/
  schema.prisma                  # model Product
  migrations/                    # riwayat perubahan tabel
  seed.js                        # data awal (Buku, Pulpen)
prisma.config.js                 # konfigurasi Prisma 7 (DATABASE_URL, seed)
src/
  app.js                         # konfigurasi Express + error handler
  lib/prisma.js                  # Prisma Client dengan adapter PostgreSQL
  routes/productRoutes.js        # definisi endpoint
  controllers/productController.js # logika CRUD memakai Prisma
frontend/                        # aplikasi React (Vite)
scripts/test-api.js              # pengujian HTTP otomatis (butuh database)
docs/DAFTAR_ENDPOINT.md          # dokumentasi endpoint
docs/LAPORAN_EVIDENCE.md         # skenario + bukti pengujian
```

## Prisma Studio

```bash
npx prisma studio
```

## Pengujian

```bash
npm test
```

Tes membuat, mengubah, dan menghapus data miliknya sendiri, jadi data lain di tabel tidak terganggu.

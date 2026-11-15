# Daftar Endpoint

Alamat dasar: `http://localhost:3000`

| Method | Endpoint | Keterangan | Respons sukses |
| --- | --- | --- | --- |
| GET | `/products` | Menampilkan seluruh produk | `200 OK`, array JSON |
| GET | `/products/:id` | Menampilkan satu produk | `200 OK`, objek JSON |
| POST | `/products` | Membuat produk baru | `201 Created`, objek JSON |
| PUT | `/products` | Mengupdate produk (body = body POST + `id`) | `200 OK`, objek JSON |
| PUT | `/products/:id` | Sama seperti di atas, `id` dari URL | `200 OK`, objek JSON |
| DELETE | `/products/:id` | Menghapus produk berdasarkan id | `200 OK`, pesan + data terhapus |

Body POST:

```json
{ "name": "Penghapus", "price": 3000 }
```

Body PUT:

```json
{ "id": 3, "name": "Penghapus Besar", "price": 4500 }
```

## Kode kesalahan

| Status | Penyebab |
| --- | --- |
| `400` | `name` kosong, `price` bukan angka atau negatif, `id` tidak valid / tidak ada pada PUT, JSON rusak |
| `404` | Produk dengan id tersebut tidak ada, atau endpoint tidak dikenal |
| `500` | Kesalahan tak terduga pada server |

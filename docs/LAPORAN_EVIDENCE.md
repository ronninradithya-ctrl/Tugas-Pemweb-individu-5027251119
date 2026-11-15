# Laporan Evidence

Pengujian dijalankan pada Node.js dengan PostgreSQL 16 dan Prisma 7. Berikut skenario dan output nyata. **Ganti blok output di bawah dengan screenshot Postman/Bruno/Hoppscotch dan screenshot Prisma Studio / psql (before–after) milik kamu.**

## Skenario

| No | Skenario | Request | Hasil |
| --- | --- | --- | --- |
| 1 | GET seluruh data | `GET /products` | 200 |
| 2 | POST sukses | `POST /products` | 201 |
| 3 | POST validasi nama kosong | `POST /products` | 400 |
| 4 | POST validasi harga negatif | `POST /products` | 400 |
| 5 | GET by id sukses | `GET /products/:id` | 200 |
| 6 | GET id tidak ada | `GET /products/999` | 404 |
| 7 | PUT sukses | `PUT /products` | 200 |
| 8 | PUT id tidak ada | `PUT /products` | 404 |
| 9 | PUT tanpa id | `PUT /products` | 400 |
| 10 | DELETE sukses | `DELETE /products/:id` | 200 |
| 11 | DELETE id tidak ada | `DELETE /products/:id` | 404 |

## Output request

```text
### 1 GET all
$ curl http://localhost:3100/products
[{"id":1,"name":"Buku","price":15000,"createdAt":"2026-11-15T12:25:40.958Z","updatedAt":"2026-11-15T12:25:40.958Z"},{"id":2,"name":"Pulpen","price":5000,"createdAt":"2026-11-15T12:25:40.958Z","updatedAt":"2026-11-15T12:25:40.958Z"}]
[HTTP 200]

### 2 POST sukses
$ curl -X POST http://localhost:3100/products -H Content-Type: application/json -d {"name":"Penghapus","price":3000}
{"id":4,"name":"Penghapus","price":3000,"createdAt":"2026-11-15T12:26:24.737Z","updatedAt":"2026-11-15T12:26:24.737Z"}
[HTTP 201]

### 3 POST validasi
$ curl -X POST http://localhost:3100/products -H Content-Type: application/json -d {"name":"","price":3000}
{"message":"Nama produk wajib diisi"}
[HTTP 400]

$ curl -X POST http://localhost:3100/products -H Content-Type: application/json -d {"name":"Tes","price":-1}
{"message":"Harga produk harus berupa angka >= 0"}
[HTTP 400]

### 6 PUT gagal
$ curl -X PUT http://localhost:3100/products -H Content-Type: application/json -d {"id":999,"name":"X","price":1}
{"message":"Produk tidak ditemukan"}
[HTTP 404]

$ curl -X PUT http://localhost:3100/products -H Content-Type: application/json -d {"name":"X","price":1}
{"message":"ID produk wajib diisi berupa bilangan bulat positif"}
[HTTP 400]

### GET by id
$ curl http://localhost:3100/products/4
{"id":4,"name":"Penghapus","price":3000,"createdAt":"2026-11-15T12:26:24.737Z","updatedAt":"2026-11-15T12:26:24.737Z"}
[HTTP 200]

### PUT sukses
$ curl -X PUT http://localhost:3100/products -H Content-Type: application/json -d {"id":4,"name":"Penghapus Besar","price":4500}
{"id":4,"name":"Penghapus Besar","price":4500,"createdAt":"2026-11-15T12:26:24.737Z","updatedAt":"2026-11-15T12:26:34.614Z"}
[HTTP 200]

### PUT sukses
$ curl -X PUT http://localhost:3100/products -H Content-Type: application/json -d {"id":4,"name":"Penghapus Besar","price":4500}
{"id":4,"name":"Penghapus Besar","price":4500,"createdAt":"2026-11-15T12:26:24.737Z","updatedAt":"2026-11-15T12:26:34.614Z"}
[HTTP 200]

### DELETE sukses
$ curl -X DELETE http://localhost:3100/products/4
{"message":"Produk berhasil dihapus","product":{"id":4,"name":"Penghapus Besar","price":4500,"createdAt":"2026-11-15T12:26:24.737Z","updatedAt":"2026-11-15T12:26:34.614Z"}}
[HTTP 200]

### DELETE ulang
$ curl -X DELETE http://localhost:3100/products/4
{"message":"Produk tidak ditemukan"}
[HTTP 404]
```

## Perubahan database (before - after)

**Sebelum POST**

```text
id |  name  | price 
----+--------+-------
  1 | Buku   | 15000
  2 | Pulpen |  5000
(2 rows)
```

**Setelah POST** (produk Penghapus ditambahkan)

```text
id |   name    | price 
----+-----------+-------
  1 | Buku      | 15000
  2 | Pulpen    |  5000
  4 | Penghapus |  3000
(3 rows)
```

**Setelah PUT** (Penghapus -> Penghapus Besar, harga 4500)

```text
id |      name       | price 
----+-----------------+-------
  1 | Buku            | 15000
  2 | Pulpen          |  5000
  4 | Penghapus Besar |  4500
(3 rows)
```

**Setelah DELETE** (id 4 hilang)

```text
id |  name  | price 
----+--------+-------
  1 | Buku   | 15000
  2 | Pulpen |  5000
(2 rows)
```

## Hasil `npm test`

```text
PASS POST /products -> 201
PASS POST nama kosong -> 400
PASS POST harga negatif -> 400
PASS POST JSON rusak -> 400
PASS GET /products -> 200
PASS GET /products/:id -> 200
PASS GET /products/abc -> 400
PASS GET /products/999999 -> 404
PASS PUT /products (id di body) -> 200
PASS PUT id tidak ada -> 404
PASS PUT tanpa id -> 400
PASS PUT nama kosong -> 400
PASS DELETE /products/:id -> 200
PASS DELETE id tidak ada -> 404
```

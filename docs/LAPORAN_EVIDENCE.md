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




<img width="1872" height="910" alt="pemweb 2" src="https://github.com/user-attachments/assets/b01c5420-32e2-4999-8b0a-bd7a1df58090" />
<img width="1446" height="870" alt="pemweb9" src="https://github.com/user-attachments/assets/c726df59-0ddc-4cfc-bedb-923cf0bf0307" />
<img width="1417" height="766" alt="pemweb8" src="https://github.com/user-attachments/assets/392995c3-2a40-4f19-8910-d732d28658d4" />
<img width="1397" height="847" alt="pemweb7" src="https://github.com/user-attachments/assets/d3134d96-916f-4b35-a208-93dd489a4804" />
<img width="1437" height="886" alt="pemweb6" src="https://github.com/user-attachments/assets/b05ce535-37d8-4e2a-956b-e6a3ffdc7426" />
<img width="1567" height="932" alt="pemweb5" src="https://github.com/user-attachments/assets/bb12b8b4-f891-4c85-b5b5-753659911e34" />
<img width="1580" height="917" alt="pemweb4" src="https://github.com/user-attachments/assets/583ae8c9-7b89-43ef-9b36-9f73b96c3735" />
<img width="1856" height="882" alt="pemweb3" src="https://github.com/user-attachments/assets/699e74df-dd9d-4058-b102-a98011d5a333" />
<img width="1846" height="917" alt="pemweb1" src="https://github.com/user-attachments/assets/431de1a1-6e3c-4e64-aa83-249b689ab66f" />

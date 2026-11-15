const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

function request(server, method, path, body, rawBody) {
  const { port } = server.address();
  const payload = rawBody ?? (body === undefined ? undefined : JSON.stringify(body));

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      } : {},
    }, (res) => {
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  let createdId;

  try {
    const created = await request(server, 'POST', '/products', { name: 'Penghapus', price: 3000 });
    assert.equal(created.status, 201);
    assert.equal(created.body.name, 'Penghapus');
    assert.equal(created.body.price, 3000);
    assert.ok(Number.isInteger(created.body.id));
    createdId = created.body.id;
    console.log(`PASS POST /products -> 201, ID ${createdId} dibuat oleh database`);

    const noName = await request(server, 'POST', '/products', { name: '  ', price: 3000 });
    assert.equal(noName.status, 400);
    assert.deepEqual(noName.body, { message: 'Nama produk wajib diisi' });
    console.log('PASS POST nama kosong -> 400');

    const badPrice = await request(server, 'POST', '/products', { name: 'Tes', price: -5 });
    assert.equal(badPrice.status, 400);
    assert.deepEqual(badPrice.body, { message: 'Harga produk harus berupa angka >= 0' });
    console.log('PASS POST harga negatif -> 400');

    const badJson = await request(server, 'POST', '/products', undefined, '{rusak');
    assert.equal(badJson.status, 400);
    console.log('PASS POST JSON rusak -> 400');

    const list = await request(server, 'GET', '/products');
    assert.equal(list.status, 200);
    assert.ok(list.body.some((p) => p.id === createdId));
    console.log('PASS GET /products -> 200, data baru ada di daftar');

    const one = await request(server, 'GET', `/products/${createdId}`);
    assert.equal(one.status, 200);
    assert.equal(one.body.id, createdId);
    console.log('PASS GET /products/:id -> 200');

    const invalidId = await request(server, 'GET', '/products/abc');
    assert.equal(invalidId.status, 400);
    console.log('PASS GET /products/abc -> 400');

    const missing = await request(server, 'GET', '/products/999999');
    assert.equal(missing.status, 404);
    assert.deepEqual(missing.body, { message: 'Produk tidak ditemukan' });
    console.log('PASS GET /products/999999 -> 404');

    const updated = await request(server, 'PUT', '/products', { id: createdId, name: 'Penghapus Besar', price: 4500 });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.name, 'Penghapus Besar');
    assert.equal(updated.body.price, 4500);
    console.log('PASS PUT /products (id di body) -> 200, data berubah');

    const updMissing = await request(server, 'PUT', '/products', { id: 999999, name: 'X', price: 1 });
    assert.equal(updMissing.status, 404);
    console.log('PASS PUT id tidak ada -> 404');

    const updNoId = await request(server, 'PUT', '/products', { name: 'X', price: 1 });
    assert.equal(updNoId.status, 400);
    console.log('PASS PUT tanpa id -> 400');

    const updInvalid = await request(server, 'PUT', '/products', { id: createdId, name: '', price: 1 });
    assert.equal(updInvalid.status, 400);
    console.log('PASS PUT nama kosong -> 400');

    const del = await request(server, 'DELETE', `/products/${createdId}`);
    assert.equal(del.status, 200);
    assert.equal(del.body.product.id, createdId);
    createdId = undefined;
    console.log('PASS DELETE /products/:id -> 200');

    const delMissing = await request(server, 'DELETE', '/products/999999');
    assert.equal(delMissing.status, 404);
    console.log('PASS DELETE id tidak ada -> 404');
  } finally {
    if (createdId) await prisma.product.deleteMany({ where: { id: createdId } });
    await new Promise((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

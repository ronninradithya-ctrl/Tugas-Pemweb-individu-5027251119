const prisma = require('../src/lib/prisma');

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Seed dilewati, tabel products sudah berisi ${count} data.`);
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: 'Buku', price: 15000 },
      { name: 'Pulpen', price: 5000 },
    ],
  });
  console.log('Seed berhasil: Buku dan Pulpen ditambahkan.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

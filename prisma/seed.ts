import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@sitabi.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@sitabi.com',
      password: hashedPassword,
    },
  });

  // Dosen
  const dosenUser = await prisma.user.upsert({
    where: { email: 'dosen@sitabi.com' },
    update: {},
    create: {
      name: 'Budi Santoso, M.Kom',
      email: 'dosen@sitabi.com',
      password: hashedPassword,
    },
  });

  await prisma.dosen.upsert({
    where: { userId: dosenUser.id },
    update: {},
    create: {
      userId: dosenUser.id,
      nidn: '0011223344',
    },
  });

  // Mahasiswa
  const mhsUser = await prisma.user.upsert({
    where: { email: 'mahasiswa@sitabi.com' },
    update: {},
    create: {
      name: 'Nabil',
      email: 'mahasiswa@sitabi.com',
      password: hashedPassword,
    },
  });

  await prisma.mahasiswa.upsert({
    where: { userId: mhsUser.id },
    update: {},
    create: {
      userId: mhsUser.id,
      nim: '3312001001',
      prodi: 'd4',
      angkatan: '2020',
      kelas: 'a',
    },
  });

  // Seed Pengumuman
  await prisma.pengumuman.create({
    data: {
      judul: 'Pendaftaran Sidang Akhir Semester Ganjil',
      isi: 'Diberitahukan kepada seluruh mahasiswa tingkat akhir bahwa pendaftaran sidang akhir telah dibuka mulai tanggal 1 Oktober hingga 15 Oktober. Silakan melengkapi berkas.',
      dibuatOlehId: 1, // Admin
      audiens: 'all_users',
      tanggalDibuat: new Date(),
    }
  });

  // Seed Tawaran Topik
  await prisma.tawaranTopik.create({
    data: {
      judulTopik: 'Pengembangan Sistem Pakar Diagnosa Penyakit Tanaman',
      deskripsi: 'Mencari mahasiswa yang tertarik di bidang AI dan Expert Systems.',
      userId: dosenUser.id,
      kuota: 2,
    }
  });

  // Seed Ruangan, Tugas Akhir, Sidang, Jadwal
  const ruangan = await prisma.ruangan.create({
    data: { namaRuangan: 'Ruang Sidang 1', lokasi: 'Gedung A', kapasitas: 20 }
  });

  const tugasAkhir = await prisma.tugasAkhir.create({
    data: {
      judul: 'Sistem Informasi Manajemen Skripsi',
      status: 'disetujui',
      mahasiswaId: 1, // Nabil
      tanggalPengajuan: new Date(),
    }
  });

  const sidang = await prisma.sidang.create({
    data: {
      tugasAkhirId: tugasAkhir.id,
      jenisSidang: 'akhir',
      statusHasil: 'menunggu_pelaksanaan'
    }
  });

  await prisma.jadwalSidang.create({
    data: {
      sidangId: sidang.id,
      tanggal: new Date(),
      waktuMulai: new Date('1970-01-01T08:00:00Z'),
      waktuSelesai: new Date('1970-01-01T10:00:00Z'),
      ruanganId: ruangan.id,
    }
  });

  console.log('Seed berhasil. User default dan data dummy homepage telah ditambahkan:');
  console.log('Admin: admin@sitabi.com / password123');
  console.log('Dosen: dosen@sitabi.com / password123');
  console.log('Mahasiswa: mahasiswa@sitabi.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

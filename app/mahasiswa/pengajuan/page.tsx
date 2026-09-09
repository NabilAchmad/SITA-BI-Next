import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import PengajuanForm from './pengajuan-form';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Pengajuan Tugas Akhir - SITA-BI',
};

export default async function PengajuanPage() {
  const session = await auth();

  // Pastikan user mahasiswa
  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { userId: parseInt(session?.user?.id || '0') },
    include: {
      tugasAkhir: true
    }
  });

  if (!mahasiswa) {
    redirect('/auth/login');
  }

  // Jika sudah punya TA yang tidak ditolak, tidak boleh mengajukan lagi
  const hasActiveTA = mahasiswa.tugasAkhir.some(ta => ta.status !== 'ditolak');
  if (hasActiveTA) {
    redirect('/mahasiswa/dashboard');
  }

  const tawaranTopik = await prisma.tawaranTopik.findMany({
    where: { kuota: { gt: 0 } },
    select: { id: true, judulTopik: true, kuota: true }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Pengajuan Tugas Akhir</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Lengkapi form di bawah ini untuk mengajukan judul Tugas Akhir Anda.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <PengajuanForm tawaranTopik={tawaranTopik} />
      </div>
    </div>
  );
}

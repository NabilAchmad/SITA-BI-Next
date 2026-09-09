import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileText, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

export default async function MahasiswaDashboard() {
  const session = await auth();
  
  // Find Mahasiswa ID
  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { userId: parseInt(session?.user?.id || '0') },
    include: {
      tugasAkhir: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  const latestTA = mahasiswa?.tugasAkhir[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Mahasiswa</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Selamat datang, {session?.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status TA Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Status Tugas Akhir
          </h2>

          {latestTA ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Judul Diajukan</p>
                <p className="font-medium text-gray-900 dark:text-white">{latestTA.judul}</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                  ${latestTA.status === 'disetujui' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${latestTA.status === 'ditolak' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                  ${latestTA.status === 'diajukan' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                `}>
                  {latestTA.status === 'disetujui' && <CheckCircle className="w-4 h-4" />}
                  {latestTA.status === 'ditolak' && <XCircle className="w-4 h-4" />}
                  {latestTA.status === 'diajukan' && <Clock className="w-4 h-4" />}
                  {latestTA.status.charAt(0).toUpperCase() + latestTA.status.slice(1)}
                </span>
              </div>

              {latestTA.status === 'ditolak' && latestTA.alasanPenolakan && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    <span className="font-semibold block mb-1">Alasan Penolakan:</span>
                    {latestTA.alasanPenolakan}
                  </p>
                  <div className="mt-4">
                    <Link href="/mahasiswa/pengajuan" className="text-sm font-medium text-blue-600 hover:underline">
                      Ajukan Ulang Judul &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium mb-2">Belum Ada Pengajuan</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Anda belum mengajukan judul Tugas Akhir. Silakan ajukan sekarang untuk memulai proses.
              </p>
              <Link 
                href="/mahasiswa/pengajuan"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajukan Tugas Akhir
              </Link>
            </div>
          )}
        </div>

        {/* Informasi Bimbingan Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Info Bimbingan</h2>
           <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
             <p className="text-sm">Fitur bimbingan akan aktif setelah Tugas Akhir Anda disetujui.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

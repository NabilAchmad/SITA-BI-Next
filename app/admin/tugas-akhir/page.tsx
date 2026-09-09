import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { CheckCircle, Clock, FileText, XCircle, Eye } from 'lucide-react';

export const metadata = {
  title: 'Kelola Tugas Akhir - Admin SITA-BI',
};

export default async function AdminTugasAkhirPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status || 'semua';

  const filterCondition = statusFilter === 'semua' ? {} : { status: statusFilter };

  const tugasAkhirList = await prisma.tugasAkhir.findMany({
    where: filterCondition,
    include: {
      mahasiswa: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      tanggalPengajuan: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Tugas Akhir</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Daftar pengajuan tugas akhir mahasiswa.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2 overflow-x-auto">
          <Link 
            href="/admin/tugas-akhir"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'semua' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            Semua
          </Link>
          <Link 
            href="/admin/tugas-akhir?status=diajukan"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${statusFilter === 'diajukan' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Clock className="w-4 h-4" /> Menunggu
          </Link>
          <Link 
            href="/admin/tugas-akhir?status=disetujui"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${statusFilter === 'disetujui' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <CheckCircle className="w-4 h-4" /> Disetujui
          </Link>
          <Link 
            href="/admin/tugas-akhir?status=ditolak"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${statusFilter === 'ditolak' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <XCircle className="w-4 h-4" /> Ditolak
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4">Mahasiswa</th>
                <th scope="col" className="px-6 py-4">Judul TA</th>
                <th scope="col" className="px-6 py-4">Tanggal Pengajuan</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tugasAkhirList.length > 0 ? (
                tugasAkhirList.map((ta) => (
                  <tr key={ta.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{ta.mahasiswa?.user?.name}</div>
                      <div className="text-gray-500">{ta.mahasiswa?.nim}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 max-w-xs" title={ta.judul}>{ta.judul}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(ta.tanggalPengajuan), 'dd MMM yyyy', { locale: localeId })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium
                        ${ta.status === 'disetujui' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${ta.status === 'ditolak' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${ta.status === 'diajukan' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      `}>
                        {ta.status === 'disetujui' && <CheckCircle className="w-3.5 h-3.5" />}
                        {ta.status === 'ditolak' && <XCircle className="w-3.5 h-3.5" />}
                        {ta.status === 'diajukan' && <Clock className="w-3.5 h-3.5" />}
                        {ta.status.charAt(0).toUpperCase() + ta.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link 
                        href={`/admin/tugas-akhir/${ta.id}`}
                        className="inline-flex items-center justify-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-10 h-10 mb-3 text-gray-300 dark:text-gray-600" />
                      <p>Tidak ada pengajuan Tugas Akhir ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

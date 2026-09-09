import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Download } from 'lucide-react';
import ActionButtons from './action-buttons';

export default async function TugasAkhirDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) notFound();

  const ta = await prisma.tugasAkhir.findUnique({
    where: { id },
    include: {
      mahasiswa: {
        include: {
          user: true
        }
      },
      tawaranTopik: {
        include: {
          user: true
        }
      }
    }
  });

  if (!ta) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/tugas-akhir" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Pengajuan
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pengajuan Tugas Akhir</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Status */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Diajukan pada {format(new Date(ta.tanggalPengajuan), 'dd MMMM yyyy', { locale: localeId })}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
            ${ta.status === 'disetujui' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
            ${ta.status === 'ditolak' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
            ${ta.status === 'diajukan' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
          `}>
            {ta.status === 'disetujui' && <CheckCircle className="w-4 h-4" />}
            {ta.status === 'ditolak' && <XCircle className="w-4 h-4" />}
            {ta.status === 'diajukan' && <Clock className="w-4 h-4" />}
            {ta.status.charAt(0).toUpperCase() + ta.status.slice(1)}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Info Mahasiswa */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Mahasiswa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                <p className="font-medium text-gray-900 dark:text-white">{ta.mahasiswa?.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">NIM</p>
                <p className="font-medium text-gray-900 dark:text-white">{ta.mahasiswa?.nim}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Program Studi</p>
                <p className="font-medium text-gray-900 dark:text-white uppercase">{ta.mahasiswa?.prodi}</p>
              </div>
            </div>
          </div>

          {/* Info TA */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detail Tugas Akhir</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Judul yang Diajukan</p>
                <p className="font-medium text-gray-900 dark:text-white text-lg">{ta.judul}</p>
              </div>

              {ta.tawaranTopik && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-400 font-semibold mb-1">
                    Mengambil Tawaran Topik Dosen
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">{ta.tawaranTopik.judulTopik}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Oleh: {ta.tawaranTopik.user?.name}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dokumen Proposal</p>
                {ta.filePath ? (
                  <a 
                    href={ta.filePath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
                  >
                    <FileText className="w-5 h-5 text-blue-500" />
                    Lihat Dokumen Proposal (PDF)
                    <Download className="w-4 h-4 ml-1" />
                  </a>
                ) : (
                  <p className="text-gray-500 italic">Tidak ada dokumen yang diunggah.</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {ta.status === 'diajukan' && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tindakan Admin</h2>
              <ActionButtons id={ta.id} />
            </div>
          )}

          {ta.status === 'ditolak' && ta.alasanPenolakan && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <p className="font-semibold text-red-800 dark:text-red-400 mb-1">Alasan Penolakan:</p>
                <p className="text-red-800 dark:text-red-400">{ta.alasanPenolakan}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

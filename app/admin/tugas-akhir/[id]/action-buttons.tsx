'use client';

import { useState } from 'react';
import { approveTugasAkhir, rejectTugasAkhir } from '@/app/lib/actions/tugas-akhir';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActionButtons({ id }: { id: number }) {
  const [isPending, setIsPending] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [alasan, setAlasan] = useState('');
  const router = useRouter();

  async function handleApprove() {
    if (!confirm('Anda yakin ingin menyetujui pengajuan Tugas Akhir ini?')) return;
    setIsPending(true);
    try {
      await approveTugasAkhir(id);
      router.push('/admin/tugas-akhir');
    } catch (err) {
      alert('Gagal menyetujui');
      setIsPending(false);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!alasan) return alert('Alasan penolakan wajib diisi');
    setIsPending(true);
    try {
      await rejectTugasAkhir(id, alasan);
      router.push('/admin/tugas-akhir');
    } catch (err) {
      alert('Gagal menolak');
      setIsPending(false);
    }
  }

  if (showRejectForm) {
    return (
      <form onSubmit={handleReject} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
        <label className="block text-sm font-medium text-red-800 dark:text-red-400 mb-2">
          Alasan Penolakan
        </label>
        <textarea
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Jelaskan alasan mengapa pengajuan ini ditolak..."
        ></textarea>
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim Penolakan'}
          </button>
          <button
            type="button"
            onClick={() => setShowRejectForm(false)}
            disabled={isPending}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg"
          >
            Batal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
      >
        <CheckCircle className="w-5 h-5" />
        Setujui Pengajuan
      </button>
      
      <button
        onClick={() => setShowRejectForm(true)}
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
      >
        <XCircle className="w-5 h-5" />
        Tolak
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createTugasAkhir } from '@/app/lib/actions/tugas-akhir';
import { ArrowRight, FileText, Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PengajuanForm({ tawaranTopik }: { tawaranTopik: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [judul, setJudul] = useState('');
  const router = useRouter();

  function handleTopikChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    if (selectedId) {
      const selectedTopik = tawaranTopik.find(t => t.id.toString() === selectedId);
      if (selectedTopik) {
        setJudul(selectedTopik.judulTopik);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      await createTugasAkhir(formData);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengajukan TA');
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Judul Tugas Akhir
        </label>
        <input
          type="text"
          name="judul"
          required
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan judul tugas akhir Anda"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Tawaran Topik (Opsional)
        </label>
        <select 
          name="tawaranTopikId"
          onChange={handleTopikChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">-- Pilih Topik (Jika Mengambil Dari Dosen) --</option>
          {tawaranTopik.map(topik => (
            <option key={topik.id} value={topik.id}>
              {topik.judulTopik} (Sisa Kuota: {topik.kuota})
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">Kosongkan jika Anda mengajukan judul mandiri.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          File Proposal (PDF)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="proposal" type="file" accept=".pdf" className="sr-only" required />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Menyimpan...
            </>
          ) : (
            <>
              <FileText className="-ml-1 mr-2 h-4 w-4" />
              Ajukan Tugas Akhir
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Dashboard Dosen</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
        <p className="text-lg">
          Selamat datang kembali, <span className="font-semibold text-blue-600">{session?.user?.name}</span>!
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Anda memiliki <span className="font-bold text-blue-500">0</span> jadwal bimbingan dan <span className="font-bold text-red-500">0</span> dokumen yang menunggu di-review.
        </p>
      </div>
    </main>
  );
}

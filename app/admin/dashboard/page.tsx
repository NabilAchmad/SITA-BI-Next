import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-800">
        <p className="text-lg">
          Selamat datang kembali, <span className="font-semibold text-blue-600">{session?.user?.name}</span>!
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gunakan menu di sebelah kiri untuk mengelola master data, akun pengguna, dan konfigurasi SITA-BI.
        </p>
      </div>
    </main>
  );
}

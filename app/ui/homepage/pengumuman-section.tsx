import { prisma } from '@/lib/prisma';
import { Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function PengumumanSection() {
  const pengumuman = await prisma.pengumuman.findMany({
    where: {
      audiens: {
        in: ['all_users', 'guest']
      }
    },
    include: {
      dibuatOleh: true,
    },
    orderBy: {
      tanggalDibuat: 'desc'
    },
    take: 6
  });

  return (
    <section id="pengumuman" className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Pengumuman</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pengumuman.length > 0 ? (
            pengumuman.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1" title={item.judul}>{item.judul}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(item.tanggalDibuat), 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4 leading-relaxed">
                  {item.isi}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 font-medium">
                  Oleh: {item.dibuatOleh?.name || 'Admin'}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <Megaphone className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">Belum ada pengumuman untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

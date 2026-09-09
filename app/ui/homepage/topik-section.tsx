import { prisma } from '@/lib/prisma';
import { BookOpen, User } from 'lucide-react';

export default async function TopikSection() {
  const topikList = await prisma.tawaranTopik.findMany({
    where: {
      kuota: {
        gt: 0
      }
    },
    include: {
      user: {
        include: {
          dosen: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 6
  });

  return (
    <section id="topik" className="bg-white dark:bg-gray-950 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Tawaran Topik</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Temukan topik tugas akhir yang sesuai dengan minat Anda dari dosen-dosen pembimbing.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topikList.length > 0 ? (
            topikList.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Sisa Kuota: {item.kuota}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2" title={item.judulTopik}>
                  {item.judulTopik}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                  {item.deskripsi}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.user?.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">Belum ada tawaran topik yang tersedia saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

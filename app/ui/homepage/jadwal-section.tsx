import { prisma } from '@/lib/prisma';
import { Calendar as CalendarIcon, Clock, MapPin, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function JadwalSection() {
  const jadwalList = await prisma.jadwalSidang.findMany({
    include: {
      ruangan: true,
      sidang: {
        include: {
          tugasAkhir: {
            include: {
              mahasiswa: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      tanggal: 'desc'
    },
    take: 6
  });

  return (
    <section id="jadwal" className="bg-blue-50 dark:bg-gray-900/50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Jadwal Sidang</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Informasi jadwal pelaksanaan sidang tugas akhir mahasiswa.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jadwalList.length > 0 ? (
            jadwalList.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id })}</span>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {item.sidang?.jenisSidang}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 line-clamp-2" title={item.sidang?.tugasAkhir?.judul}>
                    {item.sidang?.tugasAkhir?.judul}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{item.sidang?.tugasAkhir?.mahasiswa?.user?.name}</span>
                      <span className="text-gray-500">({item.sidang?.tugasAkhir?.mahasiswa?.nim})</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{format(new Date(item.waktuMulai), 'HH:mm')} - {format(new Date(item.waktuSelesai), 'HH:mm')} WIB</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{item.ruangan?.namaRuangan} ({item.ruangan?.lokasi})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <CalendarIcon className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">Belum ada jadwal sidang yang dijadwalkan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">SITA-BI</h3>
              <p className="text-gray-400 text-sm">Sistem Informasi Tugas Akhir</p>
            </div>
          </div>
          <div className="text-center md:text-right text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SITA-BI. Program Studi Bisnis Digital.<br />
            Semua hak dilindungi undang-undang.
          </div>
        </div>
      </div>
    </footer>
  );
}

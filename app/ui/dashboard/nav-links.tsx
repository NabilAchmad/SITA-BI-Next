'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Calendar,
  BookOpen
} from 'lucide-react';

const roleLinks = {
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Tugas Akhir', href: '/admin/tugas-akhir', icon: FileText },
    { name: 'Jadwal Sidang', href: '/admin/jadwal', icon: Calendar },
    { name: 'Pengguna', href: '/admin/users', icon: Users },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ],
  dosen: [
    { name: 'Dashboard', href: '/dosen/dashboard', icon: Home },
    { name: 'Bimbingan', href: '/dosen/bimbingan', icon: Users },
    { name: 'Review Dokumen', href: '/dosen/review', icon: FileText },
    { name: 'Tawaran Topik', href: '/dosen/topik', icon: BookOpen },
    { name: 'Jadwal Sidang', href: '/dosen/jadwal', icon: Calendar },
  ],
  mahasiswa: [
    { name: 'Dashboard', href: '/mahasiswa/dashboard', icon: Home },
    { name: 'Pengajuan TA', href: '/mahasiswa/pengajuan', icon: FileText },
    { name: 'Bimbingan', href: '/mahasiswa/bimbingan', icon: Users },
    { name: 'Daftar Sidang', href: '/mahasiswa/sidang', icon: Calendar },
  ]
};

export default function NavLinks({ role }: { role: 'admin' | 'dosen' | 'mahasiswa' }) {
  const pathname = usePathname();
  const links = roleLinks[role];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors',
              {
                'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400': pathname === link.href,
                'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300': pathname !== link.href,
              },
            )}
          >
            <LinkIcon className="w-5 h-5" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

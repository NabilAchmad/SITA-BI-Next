import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { GraduationCap, LogOut } from 'lucide-react';
import { signOut } from '@/auth';

export default function SideNav({ role }: { role: 'admin' | 'dosen' | 'mahasiswa' }) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href={`/${role}/dashboard`}
      >
        <div className="w-full text-white flex flex-col items-center justify-center space-y-2">
          <GraduationCap className="h-10 w-10 md:h-12 md:w-12" />
          <span className="font-bold text-lg hidden md:block">SITA-BI</span>
          <span className="text-xs font-medium uppercase tracking-wider hidden md:block bg-blue-800/50 px-2 py-1 rounded-full">{role}</span>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks role={role} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-gray-900 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors text-gray-700 dark:text-gray-300">
            <LogOut className="w-5 h-5" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

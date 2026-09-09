import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="bg-white dark:bg-gray-950 py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2 flex flex-col justify-center">
            <p className="text-blue-600 font-semibold mb-3 tracking-wide uppercase">
              Hello, Welcome
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Your ultimate solution for managing English Department thesis projects.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
              Stay organized, stay on track, and achieve your academic goals with ease.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all flex items-center justify-center gap-2 hover:gap-3">
                Login ke Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full max-w-lg mx-auto">
            <Image 
              src="/Illustration_2.png" 
              alt="Illustration SITA-BI" 
              width={600} 
              height={500} 
              className="w-full h-auto drop-shadow-xl"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}

import Navbar from '@/app/ui/homepage/navbar';
import Hero from '@/app/ui/homepage/hero';
import TopikSection from '@/app/ui/homepage/topik-section';
import JadwalSection from '@/app/ui/homepage/jadwal-section';
import PengumumanSection from '@/app/ui/homepage/pengumuman-section';
import Footer from '@/app/ui/homepage/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TopikSection />
        <JadwalSection />
        <PengumumanSection />
      </main>
      <Footer />
    </div>
  );
}

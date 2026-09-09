'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTugasAkhir(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const judul = formData.get('judul') as string;
  const tawaranTopikIdStr = formData.get('tawaranTopikId') as string;
  const file = formData.get('proposal') as File;

  if (!judul || !file) {
    throw new Error('Judul dan Proposal wajib diisi');
  }

  // Cari mahasiswa terkait user yang login
  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { userId: parseInt(session.user.id) }
  });

  if (!mahasiswa) {
    throw new Error('Data mahasiswa tidak ditemukan');
  }

  // Upload file to Vercel Blob
  const blob = await put(`proposals/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  // Insert to DB
  await prisma.tugasAkhir.create({
    data: {
      mahasiswaId: mahasiswa.id,
      judul,
      tawaranTopikId: tawaranTopikIdStr ? parseInt(tawaranTopikIdStr) : null,
      filePath: blob.url,
      status: 'diajukan',
      tanggalPengajuan: new Date(),
    }
  });

  revalidatePath('/mahasiswa/dashboard');
  redirect('/mahasiswa/dashboard');
}

export async function approveTugasAkhir(id: number) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') throw new Error('Unauthorized');

  await prisma.tugasAkhir.update({
    where: { id },
    data: { 
      status: 'disetujui',
      disetujuiOlehId: parseInt(session.user.id)
    }
  });

  revalidatePath('/admin/tugas-akhir');
}

export async function rejectTugasAkhir(id: number, alasan: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') throw new Error('Unauthorized');

  await prisma.tugasAkhir.update({
    where: { id },
    data: { 
      status: 'ditolak',
      ditolakOlehId: parseInt(session.user.id),
      alasanPenolakan: alasan
    }
  });

  revalidatePath('/admin/tugas-akhir');
}

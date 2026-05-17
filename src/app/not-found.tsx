import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold text-primary tracking-tighter">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Button nativeButton={false} render={<Link href="/" />} size="lg" className="w-full sm:w-auto">
            Kembali ke beranda
          </Button>
          <Button nativeButton={false} render={<Link href="/dashboard" />} variant="outline" size="lg" className="w-full sm:w-auto">
            Ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
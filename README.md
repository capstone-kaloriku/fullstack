Dokumentasi Proyek: Kaloriku
Status: Dalam Pengembangan (Capstone Project Coding Camp by DBS 2026)
Pengembang Utama: CC26-PSU028

1. Ringkasan Proyek (Executive Summary)
<<<<<<< HEAD
   Kaloriku (sebelumnya dikenal sebagai NutriScan) adalah aplikasi berbasis web terintegrasi kecerdasan buatan yang dirancang untuk membantu pengguna melacak asupan nutrisi dan kalori harian mereka. Sistem ini memanfaatkan Natural Language Processing (NLP) untuk menganalisis input teks dari pengguna mengenai makanan yang dikonsumsi, serta menggunakan model regresi untuk memperkirakan dan memproses nilai gizi dan kalori secara akurat.

2. Spesifikasi Teknologi (Tech Stack)
   Aplikasi ini dikembangkan menggunakan tumpukan teknologi modern untuk memastikan performa yang cepat, antarmuka yang responsif, dan komputasi AI yang efisien:

Front-End & Framework: Next.js 16, React.js, TypeScript

Styling: Tailwind CSS v4 & Shadcn UI

Machine Learning / AI: \* Natural Language Processing (NLP) untuk ekstraksi entitas makanan dari input teks.
=======
Kaloriku (sebelumnya dikenal sebagai NutriScan) adalah aplikasi berbasis web terintegrasi kecerdasan buatan yang dirancang untuk membantu pengguna melacak asupan nutrisi dan kalori harian mereka. Sistem ini memanfaatkan Natural Language Processing (NLP) untuk menganalisis input teks dari pengguna mengenai makanan yang dikonsumsi, serta menggunakan model regresi untuk memperkirakan dan memproses nilai gizi dan kalori secara akurat.

2. Spesifikasi Teknologi (Tech Stack)
Aplikasi ini dikembangkan menggunakan tumpukan teknologi modern untuk memastikan performa yang cepat, antarmuka yang responsif, dan komputasi AI yang efisien:

Front-End & Framework: Next.js 15, React.js, TypeScript

Styling: Tailwind CSS v4

Machine Learning / AI: * Natural Language Processing (NLP) untuk ekstraksi entitas makanan dari input teks.
>>>>>>> 310993b527bfbd155a07a24897974164fe2a7ebb

Model Regresi untuk estimasi dan kalkulasi data kalori/nutrisi.

Integrasi LLM (Google Gemini / Vertex AI) untuk pemrosesan teks tingkat lanjut.

<<<<<<< HEAD
Infrastruktur & Deployment: Supabase & Vercel (Free & Hobby Tier)

3. Fitur Utama (Core Features)
   Smart Text Input (Pencatatan Makanan Berbasis Teks): Pengguna dapat mengetikkan makanan yang mereka konsumsi dalam bahasa alami (misal: "Saya makan satu piring nasi goreng dengan telur mata sapi"). Sistem NLP akan mengekstrak jenis dan porsi makanan.
=======
Infrastruktur & Deployment: Supabase, Vercel (Free & Hobby Tier)

3. Fitur Utama (Core Features)
Smart Text Input (Pencatatan Makanan Berbasis Teks): Pengguna dapat mengetikkan makanan yang mereka konsumsi dalam bahasa alami (misal: "Saya makan satu piring nasi goreng dengan telur mata sapi"). Sistem NLP akan mengekstrak jenis dan porsi makanan.
>>>>>>> 310993b527bfbd155a07a24897974164fe2a7ebb

Estimasi Nutrisi Presisi: Menggunakan model regresi untuk menghitung total kalori, makronutrien (protein, karbohidrat, lemak), dan mikronutrien berdasarkan entitas makanan yang terdeteksi.

Dashboard Interaktif: Antarmuka visual yang dibangun dengan Next.js dan Tailwind CSS untuk menampilkan ringkasan asupan kalori harian, target nutrisi, dan riwayat konsumsi pengguna.

4. Arsitektur Sistem (High-Level Architecture)
<<<<<<< HEAD
   Client-Side (User Interface): Pengguna berinteraksi dengan aplikasi web Next.js, memasukkan data makanan harian melalui antarmuka.
=======
Client-Side (User Interface): Pengguna berinteraksi dengan aplikasi web Next.js, memasukkan data makanan harian melalui antarmuka.
>>>>>>> 310993b527bfbd155a07a24897974164fe2a7ebb

API Processing: Permintaan dikirim ke server backend/API. Jika input berupa bahasa alami, teks tersebut diproses terlebih dahulu.

AI & ML Layer:

Teks -> NLP: Mengekstrak nama makanan dan kuantitas.

Data -> Regresi: Mencocokkan makanan dengan database nutrisi dan menghitung estimasi kalori dengan algoritma regresi.

Database & Cloud: Data hasil pemrosesan disimpan di database, dan seluruh infrastruktur di-hosting serta dikelola melalui Google Cloud Platform.

5. Manajemen Risiko & Rencana Mitigasi
<<<<<<< HEAD
   Ambiguitas Input Teks: NLP mungkin kesulitan memproses teks dengan bahasa gaul atau singkatan. Mitigasi: Mengintegrasikan prompt engineering yang kuat pada Gemini/Vertex AI dan memberikan umpan balik (feedback loop) kepada pengguna jika input tidak dikenali.
=======
Ambiguitas Input Teks: NLP mungkin kesulitan memproses teks dengan bahasa gaul atau singkatan. Mitigasi: Mengintegrasikan prompt engineering yang kuat pada Gemini/Vertex AI dan memberikan umpan balik (feedback loop) kepada pengguna jika input tidak dikenali.
>>>>>>> 310993b527bfbd155a07a24897974164fe2a7ebb

Akurasi Model Regresi: Ketidakcocokan estimasi kalori untuk makanan lokal/spesifik. Mitigasi: Memperkaya dataset pelatihan dengan data makanan lokal Indonesia.

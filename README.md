<p align="center">
  <img src="public/product-logo.png" alt="KaloriKU Logo" width="120" />
</p>

<h1 align="center">🍽️ KaloriKU</h1>

<p align="center">
  <em>Aplikasi Pencatat Kalori & Nutrisi Berbasis AI — Capstone Project Coding Camp by DBS 2026</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Groq-LLM-F55036?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI0Y1NTAzNiIvPjwvc3ZnPg==&logoColor=white" alt="Groq" />
  <img src="https://img.shields.io/badge/Status-Dalam%20Pengembangan-orange" alt="Status" />
</p>

<p align="center">
  <strong>Tim: CC26-PSU028</strong>
</p>

---

## 📖 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Struktur Proyek](#-struktur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Environment Variables](#-environment-variables)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Routes](#-api-routes)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Manajemen Risiko](#-manajemen-risiko)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang Proyek

**KaloriKU** (sebelumnya dikenal sebagai *NutriScan*) adalah aplikasi web terintegrasi kecerdasan buatan yang dirancang untuk membantu pengguna melacak asupan nutrisi dan kalori harian mereka.

Sistem ini memanfaatkan:
- **Natural Language Processing (NLP)** via IndoBERT untuk menganalisis input teks bahasa Indonesia mengenai makanan yang dikonsumsi
- **Large Language Model (LLM)** via Groq untuk pemrosesan teks tingkat lanjut, saran makanan, dan AI chatbot
- **Rumus Mifflin-St Jeor** untuk menghitung kebutuhan kalori harian (BMR & TDEE) secara akurat

> *"Biar gak gendutt wokk"* — KaloriKU Team

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🤖 **AI Chat Assistant** | Chatbot cerdas berbasis Groq LLM untuk konsultasi nutrisi, saran makanan, dan penjelasan kandungan gizi |
| 📝 **Smart Text Input** | Catat makanan dengan bahasa alami (misal: *"Saya makan nasi goreng dengan telur"*) — NLP mengekstrak jenis & porsi otomatis |
| 🔍 **Klasifikasi Makanan** | IndoBERT API mengklasifikasikan jenis makanan dari input teks Indonesia |
| 📊 **Dashboard Interaktif** | Visualisasi asupan kalori harian, target nutrisi, dan riwayat konsumsi menggunakan Recharts |
| 🎯 **Target Kalori Personal** | Kalkulasi TDEE otomatis berdasarkan profil kesehatan + custom target (turun/bertahan/naik berat badan) |
| 📸 **Upload Gambar Makanan** | Upload foto makanan ke Google Cloud Storage untuk dokumentasi |
| 🏃 **Tracking Aktivitas Fisik** | Pencatatan exercise dan kalori yang terbakar |
| 📅 **Riwayat Konsumsi** | Timeline harian/mingguan/bulanan konsumsi makanan |
| 🔐 **Autentikasi** | Sistem login/register/forgot-password via Supabase Auth |
| 👤 **Onboarding** | Proses onboarding interaktif untuk mengisi profil kesehatan pengguna |
| 📱 **Responsive Design** | Antarmuka yang optimal di desktop maupun mobile |

---

## 🛠 Tech Stack

### Core Framework

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Next.js](https://nextjs.org/) | `16.x` | Fullstack React Framework (App Router) |
| [React](https://react.dev/) | `19.x` | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | `5.x` | Type-safe JavaScript |

### Styling & UI

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | `v4` | Utility-first CSS Framework |
| [shadcn/ui](https://ui.shadcn.com/) | `4.x` | Component Library (Radix-based) |
| [Lucide React](https://lucide.dev/) | `1.x` | Icon Library |
| [Tabler Icons](https://tabler.io/icons) | `3.x` | Icon Library (tambahan) |
| [React Icons](https://react-icons.github.io/) | `5.x` | Icon Library (tambahan) |

### Animasi & UX

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [GSAP](https://gsap.com/) | `3.x` | Animasi performa tinggi |
| [Motion](https://motion.dev/) (Framer Motion) | `12.x` | Deklaratif React animations |
| [Lenis](https://lenis.darkroom.engineering/) | `1.x` | Smooth scroll |
| [OGL](https://ogl.dev/) | `1.x` | WebGL micro-library |

### Backend & Database

| Teknologi | Kegunaan |
|---|---|
| [Supabase](https://supabase.com/) | PostgreSQL Database, Auth, Storage, dan Realtime |
| [Upstash Redis](https://upstash.com/) | Caching & rate limiting (serverless Redis) |
| [Google Cloud Storage](https://cloud.google.com/storage) | Object storage untuk gambar makanan |

### AI / Machine Learning

| Teknologi | Kegunaan |
|---|---|
| [Groq SDK](https://groq.com/) | LLM inference ultra-cepat untuk chatbot & food suggestion |
| IndoBERT API (eksternal) | NLP klasifikasi makanan berbahasa Indonesia |

### Forms & Validasi

| Teknologi | Kegunaan |
|---|---|
| [React Hook Form](https://react-hook-form.com/) | Form management yang performant |
| [Zod](https://zod.dev/) | Schema validation |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | Integrasi Zod + React Hook Form |

### Utilitas

| Teknologi | Kegunaan |
|---|---|
| [date-fns](https://date-fns.org/) | Utilitas manipulasi tanggal |
| [mathjs](https://mathjs.org/) | Komputasi matematika lanjutan |
| [Recharts](https://recharts.org/) | Library chart untuk visualisasi data nutrisi |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Render markdown dari respons AI |
| [React Circular Progressbar](https://www.npmjs.com/package/react-circular-progressbar) | Circular progress untuk target kalori |
| [React Day Picker](https://daypicker.dev/) | Date picker untuk pemilihan tanggal |
| [React Scroll](https://www.npmjs.com/package/react-scroll) | Smooth scroll navigation |
| [TanStack Table](https://tanstack.com/table/) | Headless table untuk data makanan |

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  Next.js 16 App Router · React 19 · Tailwind CSS v4        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Landing  │  │   Auth   │  │Dashboard │  │ AI Chat   │  │
│  │  Page    │  │  Pages   │  │  Pages   │  │ Interface │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Server Actions + API Routes
┌─────────────────────▼───────────────────────────────────────┐
│                   SERVER (Next.js API)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  /api/chat   │  │ /api/classify │  │  /api/food       │  │
│  │  (Groq LLM)  │  │ (IndoBERT)   │  │  /api/exercises  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌────────▼─────────┐  │
│  │  Groq SDK    │  │ IndoBERT API │  │   Server Actions  │  │
│  │  (LLM)       │  │ (Railway)    │  │  (Supabase CRUD)  │  │
│  └──────────────┘  └──────────────┘  └────────┬──────────┘  │
└───────────────────────────────────────────────┬─────────────┘
                                                │
┌───────────────────────────────────────────────▼─────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Supabase    │  │ Upstash      │  │  Google Cloud    │  │
│  │  (PostgreSQL │  │ Redis        │  │  Storage         │  │
│  │   + Auth)    │  │ (Cache)      │  │  (Images)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Struktur Proyek

```
fullstack/
├── public/                          # Aset statis
│   ├── product-logo.png             # Logo KaloriKU
│   ├── carousel/                    # Gambar carousel landing page
│   ├── developer/                   # Foto developer/tim
│   ├── parallax/                    # Aset efek parallax
│   └── step-*.png                   # Gambar langkah-langkah onboarding
│
├── src/
│   ├── actions/                     # Server Actions
│   │   ├── chat-history.ts          # CRUD riwayat chat AI
│   │   ├── custom-food.ts           # Manajemen makanan custom
│   │   ├── food-explanation.ts      # Penjelasan nutrisi makanan via AI
│   │   ├── food-suggestion.ts       # Saran makanan via AI
│   │   └── upload-image.ts          # Upload gambar ke GCS
│   │
│   ├── app/
│   │   ├── (auth)/                  # Route group: Autentikasi
│   │   │   ├── login/               # Halaman login
│   │   │   ├── register/            # Halaman register
│   │   │   ├── forgot-password/     # Halaman reset password
│   │   │   ├── logout/              # Proses logout
│   │   │   └── onboarding/          # Onboarding profil kesehatan
│   │   │
│   │   ├── (dashboard)/             # Route group: Dashboard utama
│   │   │   ├── actions.ts           # Server actions (food, profile, logs)
│   │   │   ├── ai/                  # Halaman AI chatbot
│   │   │   ├── all-foods/           # Katalog semua makanan
│   │   │   ├── dashboard/           # Dashboard utama
│   │   │   ├── logs/                # Riwayat konsumsi
│   │   │   └── profile/             # Profil & pengaturan
│   │   │
│   │   ├── (landing-page)/          # Route group: Landing page publik
│   │   │   ├── layout.tsx           # Layout landing page
│   │   │   └── page.tsx             # Halaman utama landing
│   │   │
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/                # Auth endpoints
│   │   │   ├── chat/                # AI chat endpoint (Groq)
│   │   │   ├── classify/            # Klasifikasi makanan (IndoBERT)
│   │   │   ├── exercises/           # Data exercise
│   │   │   └── food/                # Data makanan
│   │   │
│   │   ├── globals.css              # Global styles + Tailwind config
│   │   ├── layout.tsx               # Root layout
│   │   └── not-found.tsx            # Halaman 404
│   │
│   ├── components/
│   │   ├── ui/                      # Komponen shadcn/ui
│   │   ├── animations/              # Komponen animasi (GSAP/Motion)
│   │   ├── layout/                  # Komponen layout (Navbar, Footer, dll)
│   │   ├── CardGlow.tsx             # Kartu dengan efek glow
│   │   ├── DashboardSidebar.tsx     # Sidebar navigasi dashboard
│   │   ├── GlassSurface.tsx         # Komponen glassmorphism
│   │   ├── GradualBlurBackground.tsx # Background blur bertahap
│   │   ├── MagicBento.tsx           # Bento grid layout
│   │   ├── ScrollReveal.tsx         # Animasi scroll reveal
│   │   ├── Stepper.tsx              # Stepper untuk onboarding
│   │   ├── TextPressure.tsx         # Efek teks interaktif
│   │   └── Tooltip.tsx              # Custom tooltip
│   │
│   ├── data/                        # Data statis / dummy
│   │   ├── dummy-food.json          # Data makanan dummy
│   │   └── dummyUserData.json       # Data user dummy
│   │
│   ├── lib/                         # Library & utilitas
│   │   ├── groq-client.ts           # Groq SDK client
│   │   ├── indobert-api.ts          # IndoBERT API helper
│   │   ├── nutrition.ts             # Utilitas kalkulasi nutrisi
│   │   ├── supabase/                # Supabase client (server/client)
│   │   ├── use-mobile.ts            # Hook deteksi perangkat mobile
│   │   └── utils.ts                 # Utilitas umum (cn, dll)
│   │
│   ├── proxy.ts                     # Proxy configuration
│   └── types/                       # TypeScript type definitions
│       └── index.ts                 # Shared interfaces & types
│
├── .env                             # Environment variables (JANGAN di-commit!)
├── Dockerfile                       # Docker configuration
├── components.json                  # shadcn/ui configuration
├── next.config.ts                   # Next.js configuration
├── postcss.config.mjs               # PostCSS configuration
├── tailwind.config.ts               # Tailwind CSS configuration (jika ada)
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies & scripts
```

---

## 📋 Prasyarat

Pastikan kamu sudah menginstal:

| Software | Versi Minimum | Link Download |
|---|---|---|
| **Node.js** | `v20.x` atau lebih baru | [nodejs.org](https://nodejs.org/) |
| **npm** | `v10.x` | Terinstal bersama Node.js |
| **Git** | Terbaru | [git-scm.com](https://git-scm.com/) |

Serta akun pada layanan berikut:

- [Supabase](https://supabase.com/) — Database & Auth
- [Groq](https://console.groq.com/) — API Key untuk LLM
- [Upstash](https://upstash.com/) — Redis untuk caching
- [Google Cloud Platform](https://console.cloud.google.com/) — Cloud Storage

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/capstone-kaloriku.git
cd capstone-kaloriku/fullstack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Salin file `.env.example` dan isi dengan kredensial yang sesuai:

```bash
cp .env.example .env
```

> Lihat bagian [Environment Variables](#-environment-variables) untuk detail setiap variabel.

### 4. Setup Supabase

1. Buat project baru di [Supabase Dashboard](https://app.supabase.com/)
2. Jalankan migration SQL untuk membuat tabel yang dibutuhkan (lihat [Database Schema](#-database-schema))
3. Salin `Project URL` dan `anon key` ke file `.env`

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔐 Environment Variables

Buat file `.env` di root proyek dengan variabel berikut:

```env
# ═══════════════════════════════════════════
# SUPABASE
# ═══════════════════════════════════════════
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ═══════════════════════════════════════════
# GROQ (LLM AI)
# ═══════════════════════════════════════════
GROQ_API_KEY=gsk_your-groq-api-key

# ═══════════════════════════════════════════
# UPSTASH REDIS (Caching)
# ═══════════════════════════════════════════
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# ═══════════════════════════════════════════
# GOOGLE CLOUD PLATFORM (Storage)
# ═══════════════════════════════════════════
GCP_PROJECT_ID=your-gcp-project-id
GCP_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GCP_BUCKET_NAME=your-bucket-name

# ═══════════════════════════════════════════
# INDOBERT / ML API (Railway)
# ═══════════════════════════════════════════
RAILWAY_API_URL=https://your-indobert-api.railway.app
```

> ⚠️ **Jangan pernah commit file `.env` ke repository!** File ini sudah di-include dalam `.gitignore`.

---

## ▶️ Menjalankan Aplikasi

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server (hot-reload) |
| `npm run build` | Build aplikasi untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint untuk pengecekan kode |

### 🐳 Docker

```bash
# Build image
docker build -t kaloriku .

# Jalankan container
docker run -p 3000:3000 --env-file .env kaloriku
```

---

## 🔌 API Routes

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/auth/*` | `POST` | Autentikasi pengguna (via Supabase Auth) |
| `/api/chat` | `POST` | Chat dengan AI assistant (Groq LLM) |
| `/api/classify` | `POST` | Klasifikasi makanan dari teks (IndoBERT NLP) |
| `/api/food/[name]` | `GET` | Ambil detail makanan berdasarkan nama |
| `/api/food/search` | `GET` | Cari makanan di database |
| `/api/exercises` | `GET/POST` | Data aktivitas fisik / exercise |

---

## 🗄 Database Schema

Aplikasi menggunakan **Supabase (PostgreSQL)** dengan tabel utama:

```
┌─────────────────┐       ┌─────────────────────┐
│     users        │       │   health_profiles    │
├─────────────────┤       ├─────────────────────┤
│ user_id (PK)    │──────▶│ user_id (FK)        │
│ name            │       │ date_of_birth       │
│ email           │       │ weight_kg           │
│ gender          │       │ height_cm           │
│ created_at      │       │ activity_level      │
└─────────────────┘       │ bmr / tdee          │
                          │ target_calories     │
                          │ goal_type           │
                          │ recorded_at         │
                          └─────────────────────┘

┌─────────────────┐       ┌─────────────────────┐
│   food_items     │       │  consumption_logs    │
├─────────────────┤       ├─────────────────────┤
│ food_id (PK)    │◀──────│ food_id (FK)        │
│ name            │       │ log_id (PK)         │
│ slug            │       │ user_id (FK)        │
│ calories        │       │ consumed_portion    │
│ protein_gram    │       │ total_calories      │
│ carbs_gram      │       │ meal_type (enum)    │
│ fat_gram        │       │ raw_input_text      │
│ category        │       │ logged_at           │
│ image_url       │       └─────────────────────┘
│ base_portion_gram│
│ is_verified     │
└─────────────────┘
```

**Enum `meal_category`**: Sarapan, Makan Siang, Makan Malam, Snack

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push kode ke GitHub
2. Import project di [Vercel Dashboard](https://vercel.com/dashboard)
3. Tambahkan semua environment variables
4. Deploy! 🎉

### Docker

```bash
docker build -t kaloriku .
docker run -p 3000:3000 --env-file .env kaloriku
```

---

## ⚠️ Manajemen Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Ambiguitas Input Teks** | NLP gagal memproses bahasa gaul/singkatan | Prompt engineering pada Groq LLM + feedback loop ke pengguna |
| **Akurasi Kalori** | Estimasi tidak akurat untuk makanan lokal | Memperkaya dataset dengan data makanan Indonesia |
| **Rate Limiting API** | Layanan AI tidak responsif saat traffic tinggi | Upstash Redis untuk caching + rate limiting |
| **Data Privacy** | Kebocoran data kesehatan pengguna | Supabase RLS (Row Level Security) + enkripsi |
| **Cold Start** | IndoBERT API lambat saat pertama kali diakses | Railway auto-scaling + health check endpoint |

---

## 🧮 Kalkulasi Nutrisi

KaloriKU menggunakan **Persamaan Mifflin-St Jeor** untuk menghitung BMR:

```
Laki-laki: BMR = (10 × berat[kg]) + (6.25 × tinggi[cm]) − (5 × usia) + 5
Perempuan: BMR = (10 × berat[kg]) + (6.25 × tinggi[cm]) − (5 × usia) − 161
```

**TDEE (Total Daily Energy Expenditure)** = BMR × Activity Multiplier:

| Level Aktivitas | Multiplier |
|---|---|
| Sangat Ringan | 1.2 |
| Ringan | 1.375 |
| Sedang | 1.55 |
| Berat | 1.725 |
| Sangat Berat | 1.9 |

**Distribusi Makronutrien:**
- 🥩 Protein: 20% dari TDEE (÷ 4 kcal/g)
- 🧈 Lemak: 25% dari TDEE (÷ 9 kcal/g)
- 🍚 Karbohidrat: 55% dari TDEE (÷ 4 kcal/g)

---

## 📄 Lisensi

Proyek ini dikembangkan sebagai bagian dari **Capstone Project — Coding Camp 2026 by DBS Foundation**.

---

<p align="center">
  <img src="public/product-logo.png" alt="KaloriKU" width="48" />
  <br />
  <sub>Dibuat dengan ❤️ oleh Tim CC26-PSU028</sub>
</p>

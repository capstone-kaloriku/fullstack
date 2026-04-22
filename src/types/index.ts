export interface FoodSummariesProps {
  id: number;
  nama: string;
  gambar: string;
  kalori: number;
  karbo: number;
  protein: number;
  lemak: number;
  kategori: string;
}

export interface persentageProps {
  value: number;
  maxValue: number;
}

export interface CategoryProps {
  data: {
    id: number;
    icon: React.ReactNode;
    title: string;
  }[];
}

export interface FrequentlyProps {
  data: {
    id: number;
    nama: string;
    gambar: string;
    kalori: number;
    porsi: number;
    takaranSaji: number;
    slug: string;
  }[];
}

export interface PageProps {
  params: Promise<{ slug: string }>;
}

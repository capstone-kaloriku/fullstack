export interface FoodSummariesProps {
  id: string | number;
  nama: string;
  gambar: string;
  kalori: number;
  karbo: number;
  protein: number;
  lemak: number;
  kategori: string;
  slug: string;
}

export interface FoodLogEntry {
  data: {
    id: number;
    label: string;
    jumlah: number;
    jenisTakaran: string;
  }[];
}

export interface persentageProps {
  value: number;
  maxValue: number;
}

export interface CategoryProps {
  data: {
    id: string | number;
    icon: React.ReactNode;
    title: string;
    filterKey: string;
  }[];
  activeFilter: string | null;
  onFilter: (filterKey: string | null) => void;
}

export interface FrequentlyProps {
  data: {
    id: string | number;
    nama: string;
    gambar: string;
    kalori: number;
    porsi: number;
    takaranSaji: number;
    slug: string;
  }[];
}

export interface SettingsProps {
  data: {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    url: string;
  }[];
}

export interface PageProps {
  params: Promise<{ slug: string }>;
}

export interface SliderControlProps {
  data: {
    min: number;
    max: number;
    step: number;
    defaultCalories: number;
  };
}

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

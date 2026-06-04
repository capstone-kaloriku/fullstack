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

export interface SideDish {
  nama: string;
  porsi: number;
  kalori?: number;
}

export interface FoodLogEntry {
  items: SideDish[];
  onRemove: (index: number) => void;
  onChangePorsi: (index: number, newPorsi: number) => void;
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

export interface RecentlyAddedItem {
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

export interface RecentlyAddedProps {
  items: RecentlyAddedItem[];
  isLoading: boolean;
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

export type GoalType = 'turun' | 'bertahan' | 'naik';

export interface SliderControlProps {
  data: {
    min: number;
    max: number;
    step: number;
    defaultCalories: number;
  };
  value?: number;
  onChange?: (value: number) => void;
}

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  // URL data (base64) gambar yang dilampirkan user — opsional
  image?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
}

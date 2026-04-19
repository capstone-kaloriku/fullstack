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

import { PageProps } from "@/types";
import { getFoodBySlug } from "../../actions";
import PortionInformation from "./components/PortionInformation";
import AdditionalInformation from "./components/AdditionalInformation";
import Explaination from "./components/Explaination";
import Header from "./components/Header";

const AddFood = async ({ params }: PageProps) => {
  const { slug } = await params;

  const food = await getFoodBySlug(slug);

  // Handle food not found
  if (!food) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          Makanan tidak ditemukan, atau kamu belum membuatnya?
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Sticky Header */}
      <Header food={food} />

      {/* Main Grid Content */}
      <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 justify-items-center items-start px-4 max-w-7xl py-12 mx-auto">
        <AdditionalInformation food={food} />
        <Explaination
          foodName={food.nama}
          calories={food.kalori}
          protein={food.protein}
          carbs={food.karbo}
          fat={food.lemak}
        />
        <PortionInformation food={food} />
      </div>
    </div>
  );
};

export default AddFood;

import NavWithSearch from "./components/NavWithSearchbar";
import dummyData from "@/data/dummy-food.json";
import FrequentlyEats from "./components/FrequentlyEats";

const dataRecently = dummyData.slice(0, 3);
const data = dummyData;

const AllFood = () => {
  return (
    <>
      <NavWithSearch>
        Katalog Makanan Indonesia
      </NavWithSearch>
      <div className="max-w-2xl mx-auto px-6 py-42 w-full">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center">
            <h1 className="text-lg font-bold text-primary">Input Makanan Custommu</h1>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-lg font-bold text-primary">Sering Dimakan</h1>
            <div className="flex flex-col items-center w-full gap-6">
              <FrequentlyEats data={dataRecently} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-lg font-bold text-primary">Semua Makanan</h1>
            <div className="flex flex-col items-center w-full gap-6">
              <FrequentlyEats data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllFood;

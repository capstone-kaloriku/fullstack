import dummyData from "@/data/dummy-food.json";
import DisplayFood from "./components/DisplayFood";
import CustomFood from "./components/CustomFood";

const dataRecently = dummyData.slice(0, 3);
const data = dummyData;

const AllFood = () => {
  return (
    <div className="overflow-y-auto h-screen">
      <div className="max-w-2xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-start justify-center w-full gap-6">
            <h1 className="text-lg font-bold text-primary">
              Input Makanan Custommu
            </h1>
            <CustomFood />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-lg font-bold text-primary">Sering Dimakan</h1>
            <div className="flex flex-col items-center w-full gap-6">
              <DisplayFood data={dataRecently} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-lg font-bold text-primary">Semua Makanan</h1>
            <div className="flex flex-col items-center w-full gap-6">
              <DisplayFood data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFood;

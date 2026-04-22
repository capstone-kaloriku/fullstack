import Header from "./components/Header";

import dummyData from "@/data/dummy-frequently.json";
import FrequentlyEats from "./components/FrequentlyEats";

const data = dummyData.slice(0, 3);

const AllFood = () => {
  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-6 w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-bold text-primary">Sering Dimakan</h1>
          <div className="flex flex-col items-center w-full gap-6">
            <FrequentlyEats data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllFood;

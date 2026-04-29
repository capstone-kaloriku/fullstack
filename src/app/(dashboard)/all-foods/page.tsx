import dummyData from "@/data/dummy-food.json";
import DisplayFood from "./components/DisplayFood";
import Category from "./components/Category";
import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { LiaCookieBiteSolid } from "react-icons/lia";

const dataRecently = dummyData.slice(0, 4);
const data = dummyData;

const icon = [
  {
    id: 1,
    icon: <BsSunriseFill size={24} className="text-primary" />,
    title: "MAKAN PAGI",
  },
  {
    id: 2,
    icon: <BsFillSunFill size={24} className="text-primary" />,
    title: "MAKAN SIANG",
  },
  {
    id: 3,
    icon: <BsFillMoonFill size={24} className="text-primary" />,
    title: "MAKAN MALAM",
  },
  {
    id: 4,
    icon: <LiaCookieBiteSolid size={24} className="text-primary" />,
    title: "MAKANAN RINGAN",
  },
];

const AllFood = () => {
  return (
    <div className="">
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Category data={icon} />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-lg font-bold text-primary">Sering Dimakan</h1>
            <div className="flex flex-col md:grid md:grid-cols-2 items-center w-full gap-6">
              <DisplayFood data={dataRecently} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-lg font-bold text-primary">Semua Makanan</h1>
            <div className="flex flex-col md:grid md:grid-cols-2 items-center w-full gap-6">
              <DisplayFood data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFood;

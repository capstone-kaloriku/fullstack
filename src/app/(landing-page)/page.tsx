import GradualBlurMemo from "@/components/GradualBlurBackground";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import ScrollReveal from "@/components/ScrollReveal";
import { Tooltip } from "@/components/Tooltip";
import HowToUse from "@/components/HowToUse";
import HeroSection from "./layout/HeroSection";
import TabletScrollReveal from "./layout/TabletScrollReveal";
import WhyUs from "./layout/WhyUs";

const people = [
  {
    id: 1,
    name: "Fajrin Widianto",
    designation: "Backend Lead",
    image: "/developer/fajrin.jpeg",
  },
  {
    id: 2,
    name: "Muhammad Kevin Alvarel",
    designation: "Frontend Lead",
    image: "/developer/kevinn.jpg",
  },
  {
    id: 3,
    name: "Nabila Carrissa",
    designation: "Data Scientist",
    image: "/developer/nabila.jpg",
  },
  {
    id: 4,
    name: "Shulha Diyana",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Muhammad Sausan Syafiq",
    designation: "AI Engineer",
    image: "/developer/syafiq.jpeg",
  },
  {
    id: 6,
    name: "Ananda Safrida",
    designation: "AI Engineer",
    image: "/developer/nanda.jpeg",
  },
];

const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full px-6 mx-auto flex-col items-start justify-start overflow-hidden max-w-8xl">
      <BackgroundRippleEffect />
      <div className="mt-60 md:mt-72 w-full">
        <HeroSection />
      </div>
      <div className="flex flex-col overflow-hidden mx-auto mt-60 w-full ">
        <TabletScrollReveal />
      </div>
      <div
        id="about"
        className="flex flex-col overflow-hidden mx-auto py-60 w-full max-w-6xl items-center
      "
      >
        <ScrollReveal
          baseOpacity={2}
          enableBlur
          baseRotation={7}
          blurStrength={15}
          textClassName="text-primary text-center"
        >
          Kaloriku mengatur semua kebutuhan nutrisi harianmu dengan mudah,
          membantu kamu mencapai tujuan kesehatan dengan lebih efektif.
        </ScrollReveal>
      </div>
      <div
        id="why-us"
        className="flex flex-col items-center justify-center gap-6 w-full my-36 mx-auto"
      >
        <WhyUs />
      </div>
      <HowToUse />

      <div className="flex flex-col items-center justify-center mb-10 w-full gap-6">
        <h1 className="text-xl text-primary font-bold">Meet our Developer</h1>
        <div className="flex flex-row items-center justify-center w-full">
          <Tooltip items={people} />
        </div>
      </div>
      <GradualBlurMemo
        target="page"
        position="bottom"
        height="7rem"
        strength={5}
        divCount={2}
        curve="linear"
        opacity={1}
        className="hidden md:block"
      />
    </div>
  );
};

export default Hero;

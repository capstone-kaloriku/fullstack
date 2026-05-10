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
      "/developer/nana.jpeg",
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
      <section className="mt-60 md:mt-72 w-full">
        <HeroSection />
      </section>
      <section className="flex flex-col overflow-hidden mx-auto mt-60 w-full ">
        <TabletScrollReveal />
      </section>
      <section
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
      </section>
      <section
        id="why-us"
        className="flex flex-col overflow-hidden mx-auto py-60 w-full max-w-6xl items-center z-3"
      >
        <h2 className="text-4xl font-bold text-primary">Kenapa Kaloriku?</h2>
        <WhyUs />
      </section>
      <section
        id="how-to"
        className="relative flex w-full flex-col items-center justify-center py-24 md:py-36"
      >
        <div className="relative z-10 mb-4 flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-5xl">
            Cara Penggunaan
          </h2>
          <p className="max-w-lg text-base text-muted-foreground md:text-lg">
            Empat langkah mudah untuk memulai perjalanan hidup sehatmu bersama{" "}
            <span className="font-semibold text-primary">KaloriKu</span>
          </p>
        </div>
        <HowToUse />
      </section>

      <section className="flex flex-col mx-auto max-w-6xl w-full text-center items-center py-24 md:py-36 z-3 gap-6">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-primary">Support Us</h2>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Kami membuat Kaloriku tanpa meminta biaya sedikitpun.
            <br />
            Tapi kalian bisa tetap support kami !
          </p>
        </div>
        <div className="flex flex-row items-center justify-center space-x-6">
          <Tooltip items={people} />
        </div>
      </section>
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

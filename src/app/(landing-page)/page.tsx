import GradualBlurMemo from "@/components/GradualBlurBackground";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import { Tooltip } from "@/components/Tooltip";
import HowToUse from "@/components/HowToUse";
import HeroSection from "./layout/HeroSection";
import TabletScrollReveal from "./layout/TabletScrollReveal";
import WhyUs from "./layout/WhyUs";
import ParallaxAbout from "./layout/ParallaxAbout";


const people = [
  {
    id: 1,
    name: "Fajrin Widianto",
    social: "@fajrvi",
    href: "https://www.instagram.com/fajrvi/",
    designation: "Backend Lead",
    image: "/developer/fajrin.jpeg",
  },
  {
    id: 2,
    name: "Muhammad Kevin Alvarel",
    social: "@kevinalvrl_",
    href: "https://www.instagram.com/kevinalvrl_/",
    designation: "Frontend Lead",
    image: "/developer/kevinn.jpg",
  },
  {
    id: 3,
    name: "Nabila Carrissa Dewi",
    social: "@nabilacarrissa",
    href: "https://www.instagram.com/nabilacarrissa/",
    designation: "Data Scientist",
    image: "/developer/nabila.jpg",
  },
  {
    id: 4,
    name: "Shulha Diyana",
    social: "@rchldrgn",
    href: "https://www.instagram.com/rchldrgn",
    designation: "Data Scientist",
    image:
      "/developer/nana.jpeg",
  },
  {
    id: 5,
    name: "Muhammad Sausan Syafiq",
    social: "@mhmd_s_syafiq",
    href: "https://www.instagram.com/mhmd_s_syafiq/",
    designation: "AI Engineer",
    image: "/developer/syafiq.jpeg",
  },
  {
    id: 6,
    name: "Ananda Safrida",
    social: "@nnda.fr",
    href: "https://www.instagram.com/nnda.fr/",
    designation: "AI Engineer",
    image: "/developer/nanda.jpeg",
  },
];

const Hero = () => {

  return (
    <div className="relative flex min-h-screen w-full  mx-auto flex-col items-start justify-start overflow-hidden max-w-full">
      <BackgroundRippleEffect />

      <section id="home" className="mt-60 md:mt-72 w-full">
        <HeroSection />
      </section>

      <section className="flex flex-col overflow-hidden mx-auto mt-60 w-full px-6 lg:px-12">
        <TabletScrollReveal />
      </section>

      <div className="flex flex-col overflow-hidden mx-auto py-60 w-full max-w-full items-center px-6 lg:px-12">
        <ParallaxAbout />
      </div>

      <section  className="flex flex-col overflow-hidden mx-auto py-60 w-full max-w-6xl items-center px-6 lg:px-12 z-3">
        <h2 className="text-4xl font-bold text-primary">Kenapa Kaloriku?</h2>
        <WhyUs />
      </section>

      <div className="relative flex w-full flex-col items-center justify-center py-24 md:py-36 px-6 lg:px-12">
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
      </div>


      <div id="profile" className="flex flex-col mx-auto max-w-6xl w-full text-center items-center py-24 md:py-36 z-3 gap-6 px-6">
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

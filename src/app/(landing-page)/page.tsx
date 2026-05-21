import GradualBlurMemo from "@/components/GradualBlurBackground";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import ScrollReveal from "@/components/ScrollReveal";
import { Tooltip } from "@/components/Tooltip";
import HowToUse from "@/components/HowToUse";
import ParallaxSection from "@/components/ParallaxSection";
import ParallaxLayer from "@/components/ParallaxLayer";
import SectionDivider from "@/components/SectionDivider";
import HeroSection from "./layout/HeroSection";
import TabletScrollReveal from "./layout/TabletScrollReveal";
import WhyUs from "./layout/WhyUs";
import HeroParallaxDecorations from "./layout/HeroParallaxDecorations";


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

      {/* Parallax floating decorations across entire hero */}
      <HeroParallaxDecorations />

      {/* ─── HERO SECTION ─── */}
      <section className="mt-60 md:mt-72 w-full">
        <HeroSection />
      </section>

      {/* ─── TABLET SCROLL REVEAL ─── */}
      <section className="flex flex-col overflow-hidden mx-auto mt-60 w-full ">
        <TabletScrollReveal />
      </section>

      {/* ─── WAVE DIVIDER INTO WARM SECTION ─── */}
      <SectionDivider variant="wave" />

      {/* ─── ABOUT SECTION — warm background with parallax orbs ─── */}
      <ParallaxSection
        id="about"
        variant="warm"
        showOrbs
        showGrain
        className="w-full"
      >
        <div className="flex flex-col overflow-hidden mx-auto py-60 w-full max-w-6xl items-center px-6">
          {/* Parallax-wrapped content: text scrolls slightly slower for depth */}
          <ParallaxLayer speed={0.9}>
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
          </ParallaxLayer>
        </div>
      </ParallaxSection>

      {/* ─── WAVE DIVIDER (flipped) back to default ─── */}
      <SectionDivider variant="wave" flip />

      {/* ─── DOT DIVIDER ─── */}
      <SectionDivider variant="dots" className="py-12" />


      <div className="flex flex-col overflow-hidden mx-auto py-60 w-full max-w-6xl items-center px-6 z-3">
        <ParallaxLayer speed={0.85}>
          <h2 className="text-4xl font-bold text-primary">Kenapa Kaloriku?</h2>
        </ParallaxLayer>
        <WhyUs />
      </div>

      {/* ─── GRADIENT DIVIDER ─── */}
      <SectionDivider variant="gradient" />

      <div className="relative flex w-full flex-col items-center justify-center py-24 md:py-36 px-6">
        <div className="relative z-10 mb-4 flex flex-col items-center gap-4 text-center">
          <ParallaxLayer speed={0.85}>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-5xl">
              Cara Penggunaan
            </h2>
          </ParallaxLayer>
          <ParallaxLayer speed={0.9}>
            <p className="max-w-lg text-base text-muted-foreground md:text-lg">
              Empat langkah mudah untuk memulai perjalanan hidup sehatmu bersama{" "}
              <span className="font-semibold text-primary">KaloriKu</span>
            </p>
          </ParallaxLayer>
        </div>
        <HowToUse />
      </div>

      {/* ─── WAVE DIVIDER ─── */}
      <SectionDivider variant="wave" />

      {/* ─── SUPPORT US SECTION — warm background ─── */}
      <ParallaxSection
        id="profile"
        variant="warm"
        showOrbs
        showGrain
        className="w-full"
      >
        <div className="flex flex-col mx-auto max-w-6xl w-full text-center items-center py-24 md:py-36 z-3 gap-6 px-6">
          <ParallaxLayer speed={0.8}>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-primary">Support Us</h2>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                Kami membuat Kaloriku tanpa meminta biaya sedikitpun.
                <br />
                Tapi kalian bisa tetap support kami !
              </p>
            </div>
          </ParallaxLayer>
          <div className="flex flex-row items-center justify-center space-x-6">
            <Tooltip items={people} />
          </div>
        </div>
      </ParallaxSection>

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

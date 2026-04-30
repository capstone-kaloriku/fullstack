import { FadeUpPyramid } from "@/components/animations/FadeUpPyramid";
import GradualBlurMemo from "@/components/GradualBlurBackground";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import MagicBento from "@/components/MagicBento";
import ScrollReveal from "@/components/ScrollReveal";
import { Tooltip } from "@/components/Tooltip";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

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
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full px-6 mx-auto flex-col items-start justify-start overflow-hidden max-w-8xl">
      <BackgroundRippleEffect />
      <div className="mt-60 md:mt-72 w-full">
        <FadeUpPyramid position="center" delay={0.05}>
          <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-3xl lg:text-6xl dark:text-neutral-100">
            Kendalikan Kalori harianmu, dengan{" "}
            <span className="text-primary">KaloriKu.</span>
          </h2>
        </FadeUpPyramid>
        <FadeUpPyramid position="center" delay={0.05}>
          <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
            Pendamping setia untuk perjalanan hidup sehatmu. Tracking nutrisi
            presisi untuk bantu kamu mencapai target berat badan lebih efektif.
          </p>
        </FadeUpPyramid>
      </div>
      <div className="flex flex-col overflow-hidden mx-auto mt-60 w-full">
        <FadeUpPyramid position="center" delay={0.05}>
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  Terus pantau kesehatan kamu dengan
                  <br />
                  <span className="text-7xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                    Kaloriku
                  </span>
                </h1>
              </>
            }
          >
            <Image
              src={`/dashboard.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-center"
              draggable={false}
            />
          </ContainerScroll>
        </FadeUpPyramid>
      </div>
      <div className="flex flex-col overflow-hidden mx-auto my-60 w-full max-w-6xl items-center">
        <ScrollReveal
          baseOpacity={0.2}
          enableBlur
          baseRotation={7}
          blurStrength={15}
          textClassName="text-primary text-center"
        >
          Kaloriku mengatur semua kebutuhan nutrisi harianmu dengan mudah,
          membantu kamu mencapai tujuan kesehatan dengan lebih efektif.
        </ScrollReveal>
      </div>
      <div className="grid grid-cols items-center gap-6 justify-center w-full my-36 mx-auto">
        <h1 className="text-4xl font-bold text-primary">Kenapa Kaloriku?</h1>
        <MagicBento
          textAutoHide={true}
          enableStars
          enableSpotlight
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect
          spotlightRadius={400}
          particleCount={12}
          glowColor="255, 107, 0"
          disableAnimations={false}
        />
      </div>

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

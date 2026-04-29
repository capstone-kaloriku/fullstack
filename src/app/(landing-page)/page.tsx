import { FadeUpPyramid } from "@/components/animations/FadeUpPyramid";
import CardGlow from "@/components/CardGlow";
import GradualBlurMemo from "@/components/GradualBlurBackground";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import { Tooltip } from "@/components/Tooltip";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

const whyKaloriku = [
  {
    id: 1,
    title: "Tracking Nutrisi Presisi",
    description:
      "KaloriKu memberikan data nutrisi yang akurat untuk membantu kamu memahami asupan harianmu dengan lebih baik.",
  },
  {
    id: 2,
    title: "Rencana Makan yang Disesuaikan",
    description:
      "Dapatkan rekomendasi rencana makan yang disesuaikan dengan kebutuhan dan preferensi kamu untuk mencapai tujuan kesehatanmu.",
  },
  {
    id: 3,
    title: "Gratis dan Mudah Digunakan",
    description:
      "Gratis untuk digunakan, KaloriKu menawarkan antarmuka yang sederhana dan intuitif sehingga kamu bisa langsung mulai mengelola kalori harianmu tanpa ribet.",
  },
  {
    id: 4,
    title: "Pengingat Makan dan Minum",
    description:
      "Dapatkan notifikasi waktu makan dan minum supaya rutinitas sehatmu tetap konsisten sepanjang hari.",
  },
  {
    id: 5,
    title: "Riwayat dan Ringkasan Harian",
    description:
      "Lihat ringkasan asupan harian dan riwayat mingguan untuk memantau progres dengan mudah.",
  },
  {
    id: 6,
    title: "Cocok untuk Berbagai Target",
    description:
      "Baik ingin turun, naik, atau menjaga berat badan, KaloriKu membantu menyesuaikan kebutuhanmu.",
  },
];

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
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
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
        <FadeUpPyramid position="center" delay={0.05} >
          <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-3xl lg:text-6xl dark:text-neutral-100">
            Kendalikan Kalori harianmu, dengan{" "}
            <span className="text-primary">KaloriKu.</span>
          </h2>
        </FadeUpPyramid>
        <FadeUpPyramid position="center" delay={0.05} >
          <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
            Pendamping setia untuk perjalanan hidup sehatmu. Tracking nutrisi
            presisi untuk bantu kamu mencapai target berat badan lebih efektif.
          </p>
        </FadeUpPyramid>
      </div>
      <div className="flex flex-col overflow-hidden mx-auto mt-60 w-full">
        <FadeUpPyramid position="center" delay={0.05} >
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
              src={`/landingpage.jpg`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </FadeUpPyramid>
      </div>
      <div className="grid grid-cols items-center gap-6 justify-center w-full my-36 mx-auto">
        <h1 className="text-4xl font-bold text-primary">Kenapa Kaloriku?</h1>
        <div className="grid grid-cols md:grid-cols-3 gap-6 justify-center w-full max-w-6xl">
          {whyKaloriku.map((item) => (
            <CardGlow
              edgeSensitivity={30}
              glowColor="80 80 80"
              backgroundColor="#ff6b00"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={["#1c1917", "#6E4816", "#0f766e"]}
              key={item.id}
            >
              <div className="flex flex-col gap-3 p-[2em] text-primary-foreground">
                <h2 className="font-extrabold text-lg">{item.title}</h2>
                <p className="text-sm text-secondary">{item.description}</p>
              </div>
            </CardGlow>
          ))}
        </div>
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
        strength={2}
        divCount={1}
        curve="linear"
        exponential
        opacity={1}
        className="hidden md:block"
      />
    </div >
  );
};

export default Hero;

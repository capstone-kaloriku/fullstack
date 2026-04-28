import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full px-6 mx-auto flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      <div className="mt-60 md:mt-96 w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-3xl lg:text-6xl dark:text-neutral-100">
          Kendalikan Kalori harianmu, dengan <span className="text-primary">KaloriKu.</span>
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Pendamping setia untuk perjalanan hidup sehatmu. Tracking nutrisi presisi untuk bantu kamu mencapai target berat badan lebih efektif.
        </p>
      </div>
      <div className="flex flex-col overflow-hidden mx-auto mt-60 w-full">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Terus pantau kesehatan kamu dengan<br />
                <span className="text-7xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                  Kaloriku
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={`/linear.webp`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </div>
  );
}

export default Hero
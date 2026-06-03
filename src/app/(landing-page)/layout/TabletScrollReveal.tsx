import { FadeUpPyramid } from '@/components/animations/FadeUpPyramid'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import Image from 'next/image'

function TabletScrollReveal() {
  return (
    <>
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
            src={`/logs.webp`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover object-center"
            draggable={false}
          />
        </ContainerScroll>
      </FadeUpPyramid>
    </>
  )
}

export default TabletScrollReveal
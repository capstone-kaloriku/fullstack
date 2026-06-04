import { Suspense } from "react";
import Image from "next/image";
import LoginInput from "./components/LoginInput";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import GlassSurface from "@/components/GlassSurface";

export default function Login() {
  return (
    <div className="max-w-2xl lg:max-w-7xl w-full mx-auto p-6 md:p-12 overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center mx-auto rounded-3xl p-6 md:p-12 w-full">
        {/* Left Side: Form */}
        <div>
          {/* Title Login Page */}
          <div className="text-left">
            <h1 className="font-headline text-primary text-4xl font-extrabold">
              Masuk akun Kaloriku
            </h1>
            <span className="font-mono text-lg text-muted-foreground">
              YOUR ENERGETIC SANCTUARY
            </span>
          </div>

          {/* Mobile Image — only visible on small screens */}
          <div className="mt-4 relative items-center justify-center max-w-lg mx-auto flex lg:hidden">
            <div>
              <Image
                src="/mobile-login.jpeg"
                alt="Login Screen Image"
                className="rounded-3xl ratio-16/9 object-cover"
                width={384}
                height={384}
                loading="eager"
              />
              <GlassSurface
                backgroundOpacity={0.45}
                displace={2}
                distortionScale={-180}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                brightness={100}
                opacity={0.93}
                mixBlendMode="normal"
                className="text-primary font-bold absolute left-1/2 top-1/2 translate-x-[-50%] -translate-y-[40%] text-sm text-center p-4 rounded-3xl border border-primary/5"
              >
                Start your journey to a vibrant version of yourself today.
              </GlassSurface>
            </div>
          </div>

          {/* Form */}
          <div className="mt-4">
            <Suspense>
              <LoginInput />
            </Suspense>
          </div>
        </div>

        {/* Right Side: Desktop Image — only visible on lg+ */}
        <div className="hidden lg:grid grid-cols-1 items-center justify-center relative min-h-full w-full rounded-3xl">
          <BackgroundRippleEffect rows={11} cols={9} />
        </div>
      </div>
    </div>
  );
}

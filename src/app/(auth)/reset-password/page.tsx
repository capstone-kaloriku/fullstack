import Image from "next/image";
import ResetPassword from "./components/ResetPassword";
import { BackgroundRippleEffect } from "@/components/layout/background-ripple-effect";
import GlassSurface from "@/components/GlassSurface";

const ResetPasswordPage = () => {
  return (
    <div className="max-w-2xl lg:max-w-7xl w-full mx-auto p-6 md:p-12 overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center mx-auto rounded-3xl p-6 md:p-12 w-full">
        {/* Left Side: Desktop Visual */}
        <div className="hidden lg:grid grid-cols-1 items-center justify-center relative min-h-full w-full rounded-3xl">
          <BackgroundRippleEffect rows={11} cols={9} />
        </div>

        {/* Right Side: Form */}
        <div>
          {/* Mobile Image — only visible on small screens */}
          <div className="relative items-center justify-center max-w-lg mx-auto flex lg:hidden">
            <div>
              <Image
                src="/login-screen.jpg"
                alt="Reset Password Illustration"
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
                className="text-primary-foreground font-bold absolute left-1/2 top-1/2 translate-x-[-50%] -translate-y-[120%] text-sm text-center p-4 rounded-3xl"
              >
                Kunci ulang akses akunmu dengan cepat dan aman.
              </GlassSurface>
            </div>
          </div>

          {/* Title Reset Password Page */}
          <div className="mt-6 text-left">
            <h1 className="font-headline text-primary text-4xl font-extrabold">
              Atur ulang kata sandi
            </h1>
            <span className="font-mono text-sm text-muted-foreground">
              Masukkan email dan kata sandi baru untuk mengamankan akun Anda.
            </span>
          </div>

          {/* Form */}
          <div className="mt-4">
            <ResetPassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
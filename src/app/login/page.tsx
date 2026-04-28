import Image from "next/image";
import LoginInput from "./components/LoginInput";

export default function Login() {
  return (
    <div className="max-w-2xl lg:max-w-6xl w-full mx-auto p-6 md:p-12 overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
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
                src="/login-screen.jpg"
                alt="Login Screen Image"
                className="rounded-3xl ratio-16/9 object-cover"
                width={384}
                height={384}
                loading="eager"
              />
              <span className="text-secondary-foreground absolute bottom-5 left-5 right-5 text-sm text-center p-4 bg-secondary/80 backdrop-blur-sm rounded-3xl">
                Start your journey to a vibrant version of yourself today.
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="mt-4">
            <LoginInput />
          </div>
        </div>

        {/* Right Side: Desktop Image — only visible on lg+ */}
        <div className="hidden lg:flex flex-col items-center justify-center relative">
          <Image
            src="/login-screen.jpg"
            alt="Login Screen Image"
            className="rounded-3xl object-cover w-full max-w-md xl:max-w-lg"
            width={500}
            height={600}
            loading="eager"
          />
          <span className="text-secondary-foreground absolute bottom-8 left-8 right-8 text-base text-center p-5 bg-secondary/80 backdrop-blur-sm rounded-3xl font-medium">
            Start your journey to a vibrant version of yourself today.
          </span>
        </div>
      </div>
    </div>
  );
}

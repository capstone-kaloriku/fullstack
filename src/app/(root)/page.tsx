import Image from "next/image";
import LoginInput from "./components/LoginInput";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-6 overflow-hidden">
      {/* Title Login Page */}
      <div className="text-center">
        <h1 className="font-headline text-primary text-4xl font-extrabold italic">
          Kaloriku
        </h1>
        <span className="font-mono text-lg text-muted-foreground">
          YOUR ENERGETIC SANCTUARY
        </span>
      </div>

      <div className="mt-4 relative flex items-center justify-center">
        <Image
          src="/login-screen.jpg"
          alt="Login Screen Image"
          className="rounded-3xl ratio-16/9 object-cover"
          width={350}
          height={200}
          loading="eager"
        />
        <span className="text-secondary-foreground absolute bottom-5 left-5 right-5 text-sm text-center p-4 bg-secondary/80 backdrop-blur-sm rounded-3xl">
          Start your journey to a vibrant version of yourself today.
        </span>
      </div>

      {/* Form */}
      <div className="mt-4">
        <LoginInput />
      </div>
    </div>
  );
}

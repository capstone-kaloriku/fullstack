import Image from "next/image";
import FieldInput from "./components/FieldInput";
import { FieldSeparator } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { FaGoogle } from "react-icons/fa";

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

      <div className="mt-6 relative flex items-center justify-center">
        <Image
          src="/login-screen.jpg"
          alt="Login Screen Image"
          className="rounded-3xl"
          width={400}
          height={200}
          loading="eager"
        />
        <span className="text-secondary-foreground absolute bottom-5 left-5 right-5 text-sm text-center p-4 bg-secondary/80 rounded-3xl">
          Start your journey to a vibrant version of yourself today.
        </span>
      </div>

      {/* Form */}
      <div className="mt-6">
        <FieldInput />
        <FieldSeparator className="my-6 h-3 justify-center text-sm text-secondary">
          ATAU MASUK DENGAN
        </FieldSeparator>
        <div className="flex items-center justify-center mx-auto gap-4">
          <Button variant="outline" className="w-full">
            <FaGoogle size={20} />
            Google
          </Button>
        </div>
      </div>
    </div>
  );
}

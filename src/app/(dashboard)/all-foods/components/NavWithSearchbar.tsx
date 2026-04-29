'use client'
import { useRouter } from "next/navigation";

import Searchbar from "./Searchbar";
import { Button } from "@/components/ui/button";

import { FaAngleLeft } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const NavWithSearchbar = ({ children, className }: { children: React.ReactNode; className?: string }) => {

  const router = useRouter();

  return (
    <header className={cn(`flex flex-col items-center justify-center px-6 bg-primary/80 backdrop-blur-sm pt-6 w-full rounded-bl-4xl rounded-br-4xl sticky top-0`, className)}>
      <div className="flex items-center justify-center w-full">
        <Button onClick={() => router.back()} variant="ghost" className="hover:bg-transparent">
          <FaAngleLeft size={20} className="text-primary-foreground" />
        </Button>
        <div className="flex items-center justify-center w-full">
          <h1 className="font-bold text-primary-foreground text-xl">
            {children}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <Searchbar />
      </div>
    </header>
  );
};

export default NavWithSearchbar;

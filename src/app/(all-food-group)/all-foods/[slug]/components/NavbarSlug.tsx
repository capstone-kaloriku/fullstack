'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

import { FaAngleLeft } from 'react-icons/fa6'

const NavbarSlug = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();

  return (
    <header className="flex flex-col items-center justify-center px-6 bg-primary/80 backdrop-blur-sm py-6 w-full rounded-none fixed top-0">
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
    </header>
  )
}

export default NavbarSlug
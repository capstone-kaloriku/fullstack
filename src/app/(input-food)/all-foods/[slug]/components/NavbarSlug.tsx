import Link from 'next/link'
import React from 'react'
import { FaAngleLeft } from 'react-icons/fa6'

const NavbarSlug = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="flex flex-col items-center justify-center px-6 bg-primary/80 backdrop-blur-sm py-6 w-full rounded-bl-4xl rounded-br-4xl fixed top-0">
      <div className="flex items-center justify-center w-full">
        <Link href="/all-foods">
          <FaAngleLeft size={20} className="text-primary-foreground" />
        </Link>
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
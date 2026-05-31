"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/layout/resizable-navbar";
import { Link } from "react-scroll";
import { useState } from "react";
import { FadeUpPyramid } from "../animations/FadeUpPyramid";

export function Header() {



  const navItems = [
    {
      name: "Tentang",
      link: "about",
    },
    {
      name: "Kenapa Kita",
      link: "why-us",
    },
    {
      name: "Cara Penggunaan",
      link: "how-to",
    },
    {
      name: "Profile",
      link: "profile",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <FadeUpPyramid position="left" delay={0.02} animateOnMount>
            <NavbarLogo />
          </FadeUpPyramid>

          <FadeUpPyramid
            className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium hover:text-zinc-800 lg:flex lg:space-x-2"
            position="center"
            delay={0.02}
            animateOnMount
          >
            <NavItems items={navItems} />
          </FadeUpPyramid>
          <FadeUpPyramid position="right" delay={0.02} animateOnMount>
            <div className="flex items-center gap-4">
              <NavbarButton
                href="/login"
                variant="primary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-2"
              >
                Masuk
              </NavbarButton>
            </div>
          </FadeUpPyramid>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                href="/login"
                variant="primary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-6 py-2"
              >
                Masuk
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

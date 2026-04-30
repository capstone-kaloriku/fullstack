"use client";

import Link from "next/link";
import TextPressure from "@/components/TextPressure";
import { FaGithub, FaInstagram, FaX } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const footerNavigation = {
  product: {
    title: "Produk",
    links: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Food Logs", href: "/logs" },
      { name: "AI Assistant", href: "/ai" },
      { name: "Profile", href: "/profile" },
    ],
  },
  landing: {
    title: "Halaman",
    links: [
      { name: "Tentang", href: "#tentang" },
      { name: "Kenapa Kita", href: "#kenapa-kita" },
      { name: "Cara Penggunaan", href: "#cara-penggunaan" },
      { name: "Developer", href: "#developer" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Kebijakan Privasi", href: "#" },
      { name: "Syarat & Ketentuan", href: "#" },
    ],
  },
};

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: <FaGithub />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram />,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: <FaLinkedin />,
  },
  {
    name: "Twitter / X",
    href: "https://x.com",
    icon: <FaX />,
  },
];

function Footer() {
  return (
    <footer className="relative w-full overflow-hidden z-[1000]">
      {/* Gradient separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b00]/40 to-transparent" />

      {/* Main footer content */}
      <div className="relative bg-[#0a0908]">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255, 107, 0, 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-8">
          {/* Top section: Brand + Navigation */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            {/* Brand column */}
            <div className="md:col-span-4">
              <Link href="/" className="group inline-flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-[#ff6b00] transition-colors duration-300 group-hover:text-[#ff8533]">
                    K
                  </span>
                  <span className="text-white/90">aloriku</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                Pendamping setia untuk perjalanan hidup sehatmu. Tracking
                nutrisi presisi untuk bantu kamu mencapai target berat badan
                lebih efektif.
              </p>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="group/icon flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all duration-300 hover:border-[#ff6b00]/30 hover:bg-[#ff6b00]/10 hover:text-[#ff6b00] hover:shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
              {Object.values(footerNavigation).map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#ff6b00]/70">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="group/link relative inline-flex text-sm text-white/45 transition-colors duration-300 hover:text-white/90"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#ff6b00]/50 transition-all duration-300 group-hover/link:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Text Pressure section */}
          <div className="my-2 h-[120px] md:h-[160px] lg:h-[200px] w-full select-none">
            <TextPressure
              text="Kaloriku"
              fontFamily="Compressa VF"
              fontUrl="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
              width={true}
              weight={true}
              italic={true}
              alpha={false}
              flex={true}
              stroke={false}
              scale={false}
              textColor="#ff6b00"
              className=""
              minFontSize={36}
            />
          </div>

          {/* Bottom bar */}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} Kaloriku. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

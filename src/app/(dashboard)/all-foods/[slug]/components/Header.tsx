'use client'
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface HeaderProps {
    food: {
        id: string;
        nama: string;
        kalori: number;
    };
}

function Header({ food }: HeaderProps) {
    const headerRef = useRef<HTMLHeadElement>(null)

    useGSAP(() => {
        const header = headerRef.current
        if (!header) return

        // Header mulai terlihat (di top page)
        gsap.set(header, { yPercent: 0, opacity: 1 })

        // Animasi untuk hide/show header
        const hideAnim = gsap.to(header, {
            yPercent: -100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            paused: true,
        })

        let lastScroll = 0

        ScrollTrigger.create({
            start: "top top",
            end: "max",
            onUpdate: (self) => {
                const currentScroll = self.scroll()

                if (currentScroll <= 0) {
                    // Di paling atas halaman → selalu tampilkan
                    hideAnim.reverse()
                } else if (currentScroll > lastScroll && currentScroll > 80) {
                    // Scroll ke bawah melewati 80px → sembunyikan header
                    hideAnim.play()
                } else if (currentScroll < lastScroll) {
                    // Scroll ke atas → tampilkan header
                    hideAnim.reverse()
                }

                lastScroll = currentScroll
            },
        })
    })

    return (
        <header ref={headerRef} className="sticky top-0 z-50 w-full bg-neutral-100/80 backdrop-blur-md px-4 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <Link
                    href="/all-foods"
                    className="flex items-center justify-center p-2 rounded-full hover:bg-neutral-200 transition-colors text-neutral-600 hover:text-neutral-900"
                >
                    <ChevronLeft size={20} className="stroke-[2.5]" />
                </Link>
                <div>
                    <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Detail Makanan</span>
                    <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                        {food.nama}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20 shadow-sm">
                <span>{food.kalori} kcal / porsi</span>
            </div>
        </header>
    )
}

export default Header

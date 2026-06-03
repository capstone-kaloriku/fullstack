"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/layout/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FaUser } from "react-icons/fa6";
import Image from "next/image";
import { RiGeminiFill } from "react-icons/ri";
import { MdMonitorHeart } from "react-icons/md";
import { FaAppleAlt, FaHome, FaRobot } from "react-icons/fa";
import { LogOutIcon } from "lucide-react";
import { logoutUser } from "@/app/(auth)/logout/actions";
import Link from "next/link";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <FaHome className="h-5 w-5 shrink-0 text-secondary-foreground dark:text-neutral-200" />
      ),
    },
    {
      label: "Logs",
      href: "/logs",
      icon: (
        <MdMonitorHeart className="h-5 w-5 shrink-0 text-secondary-foreground dark:text-neutral-200" />
      ),
    },
    {
      label: "All Foods",
      href: "/all-foods",
      icon: (
        <FaAppleAlt className="h-5 w-5 shrink-0 text-secondary-foreground dark:text-neutral-200" />
      ),
    },
    {
      label: "AI",
      href: "/ai",
      icon: (
        <FaRobot className="h-5 w-5 shrink-0 text-secondary-foreground dark:text-neutral-200" />
      )
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <FaUser className="h-5 w-5 shrink-0 text-secondary-foreground dark:text-neutral-200" />
      )
    },
  ];


  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-x-hidden border border-neutral-500 bg-gray-100/20 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 sticky top-0 z-50",
        "min-h-screen overflow-y-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 md:sticky md:top-0 md:h-screen">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-4">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <form action={logoutUser}>
              <button
                type="submit"
                className="flex items-center justify-start gap-2 group/sidebar py-2 w-full cursor-pointer"
              >
                <LogOutIcon className="text-secondary-foreground" />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-primary dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                >
                  Keluar
                </motion.span>
              </button>
            </form>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="w-full flex-1 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center py-1 text-sm font-normal text-primary"
    >
      <Image src="/product-logo.png" alt="Logo" width={40} height={40} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute left-8 bottom-2 font-bold italic text-xl text-primary dark:text-white"
      >
        aloriku
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src="/product-logo.png" alt="Logo" width={50} height={50} />
    </Link>
  );
};


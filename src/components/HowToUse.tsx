"use client";

import React from "react";
import Stepper, { Step } from "@/components/Stepper";
import Image from "next/image";
import { motion } from "motion/react";
import { GrNotes } from "react-icons/gr";
import { FiTarget } from "react-icons/fi";
import { GiProgression } from "react-icons/gi";
import { FaKeyboard } from "react-icons/fa";

const steps = [
  {
    title: "Buat Akun",
    description:
      "Daftarkan diri kamu dengan mudah. Cukup masukkan email dan buat password — hanya dalam beberapa detik, akun KaloriKu siap digunakan.",
    image: "/step-register.png",
    emoji: <GrNotes />,
  },
  {
    title: "Atur Target Kalori",
    description:
      "Tentukan target harian kamu berdasarkan berat badan, tinggi badan, dan tujuan kesehatan. KaloriKu akan menghitung kebutuhan nutrisi secara otomatis.",
    image: "/step-goals.png",
    emoji: <FiTarget />,
  },
  {
    title: "Catat Makanan",
    description:
      "Cukup sebutkan makananmu lalu AI kami akan mengenali jenis makanan dan menghitung kalori serta nutrisinya secara otomatis. Mudah dan cepat!",
    image: "/step-scan.jpeg",
    emoji: <FaKeyboard />,
  },
  {
    title: "Pantau Progres",
    description:
      "Lihat perkembangan nutrisi harianmu lewat dashboard yang informatif. Lacak kalori, protein, lemak, dan karbohidrat dengan mudah.",
    image: "/step-monitor.png",
    emoji: <GiProgression />,
  },
];

export default function HowToUse() {
  return (
    <>
      {/* Section header */}


      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 mt-8 w-full max-w-7xl px-5"
      >
        <Stepper
          initialStep={1}
          backButtonText="Kembali"
          nextButtonText="Lanjut"
        >
          {steps.map((step, idx) => (
            <Step key={idx}>
              <div className="flex flex-col items-center gap-6 py-4 md:flex-row md:items-start md:gap-8 max-w-xl mx-auto">
                {/* Illustration */}
                <div className="relative flex-shrink-0">
                  <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-accent/10 shadow-sm md:h-44 md:w-44">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                    {idx + 1}
                  </div>
                </div>

                {/* Text content */}
                <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                  <span className="mb-2 text-2xl text-primary">
                    {step.emoji}
                  </span>
                  <h3 className="mb-2 text-xl text-secondary-foreground font-bold tracking-tight md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </Step>
          ))}
        </Stepper>
      </motion.div>
    </>
  );
}

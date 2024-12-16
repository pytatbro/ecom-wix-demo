"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import slide1 from "@/assets/slide1.jpg";
import slide2 from "@/assets/slide2.jpg";
import slide3 from "@/assets/slide3.jpg";

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: slide1,
    url: "/",
    bg: "bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-50",
    ovl: "pink-50",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: slide2,
    url: "/",
    bg: "bg-gradient-to-r from-pink-50 via-blue-50 to-blue-50",
    ovl: "blue-50",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: slide3,
    url: "/",
    bg: "bg-gradient-to-r from-blue-50 via-yellow-50 to-yellow-50",
    ovl: "yellow-50",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden relative">
      <div
        className="flex h-full w-max transition-all duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} flex h-full w-screen flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            <div className="flex h-full flex-col items-center justify-center gap-8 text-center xl:w-1/2 2xl:gap-12">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                {slide.description}
              </h2>
              <h1 className="mx-auto max-w-lg text-5xl font-semibold lg:text-6xl 2xl:max-w-2xl 2xl:text-8xl">
                {slide.title}
              </h1>
              <Button className="h-12 rounded-md 2xl:px-10 2xl:py-8" asChild>
                <Link
                  href={slide.url}
                  className="text-primary-foreground 2xl:text-xl"
                >
                  SHOP NOW
                </Link>
              </Button>
            </div>
            <div className="relative hidden xl:block xl:h-full xl:w-1/2">
              <Image
                src={slide.img}
                alt=""
                fill
                priority
                sizes="100%"
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r from-${slide.ovl} via-transparent to-transparent`} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 m-auto flex -translate-x-1/2 gap-4">
        {slides.map((slide, index) => (
          <div
            className={`relative flex h-3 w-3 cursor-pointer items-center justify-center rounded-full ring-1 ring-gray-600 ${
              current === index ? "scale-150" : ""
            }`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

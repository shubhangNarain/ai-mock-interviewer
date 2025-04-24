"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  });

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src={"logo.svg"} width={60} height={10} alt="logo" />
      <ul className="hidden md:flex gap-6">
        <Link
          href="/dashboard"
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path === "/dashboard" && "text-primary font-bold"}
        `}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard"
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path === "/Dashboard/questions" && "text-primary font-bold"}
        `}
        >
          Questions
        </Link>
        <Link
          href="/dashboard"
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path === "/Dashboard/upgrade" && "text-primary font-bold"}
        `}
        >
          Upgrade
        </Link>
        <Link
          href="/dashboard"
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path === "/Dashboard/how" && "text-primary font-bold"}
        `}
        >
          How it works?
        </Link>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
